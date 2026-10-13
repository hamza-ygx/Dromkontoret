"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PROMPT_IDEAS, SKETCHES, sketchImage, sketchReplay, type Sketch } from "@/lib/sketches";
import { Sparks } from "./sparks";
import * as I from "./icons";

type Mode = "auto" | "live" | "replay";
type Phase = "idle" | "thinking" | "building" | "done" | "error";
type Via = "live" | "replay";
type Source =
  | { kind: "sketch"; sketch: Sketch }
  | { kind: "upload"; url: string; name: string }
  | { kind: "text"; prompt: string }
  | { kind: "edit"; prompt: string };
type Version = { html: string; label: string; slug: string };
type Payload = Record<string, unknown>;
type Settings = { mode: Mode; speed: number; code: boolean };

const DEFAULT_SETTINGS: Settings = { mode: "auto", speed: 5500, code: false };
// Bumped when defaults change so presenter browsers pick up the new ones.
const SETTINGS_KEY = "smedjan.settings.v3";
// <head>/CSS is invisible on stage, so replays push it through this much faster.
const HEAD_SPEEDUP = 8;
// One full scanner sweep over the drawing (down, then back up) before the build is revealed.
const SCAN_MS = 3400;
const FIRST_EVENT_MS = 8_000; // API never answered → fall back
const FIRST_HTML_MS = 40_000; // API answered but no output yet → fall back
const STALL_MS = 20_000; // output stopped mid-stream → fall back
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

class Stopped extends Error {}

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "app";

async function blobToBase64(blob: Blob): Promise<string> {
  const url = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
  return url.slice(url.indexOf(",") + 1);
}

// Downscale arbitrary uploads so they stay well under the request body limit.
async function fileToJpeg(file: File, max = 1568): Promise<string> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const cv = document.createElement("canvas");
  cv.width = Math.round(bmp.width * k);
  cv.height = Math.round(bmp.height * k);
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.drawImage(bmp, 0, 0, cv.width, cv.height);
  return cv.toDataURL("image/jpeg", 0.88);
}

function loadSettings(): Settings {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function Studio({ gate, live: liveAvailable, version }: { gate: boolean; live: boolean; version: string }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [via, setVia] = useState<Via | null>(null);
  const [source, setSource] = useState<Source | null>(null);
  const [thought, setThought] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [lines, setLines] = useState(0);
  const [codeTail, setCodeTail] = useState("");
  const [versions, setVersions] = useState<Version[]>([]);
  const [vIdx, setVIdx] = useState(-1);
  const [prompt, setPrompt] = useState("");
  const [edit, setEdit] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const visible = SKETCHES;
  const [dragging, setDragging] = useState(false);
  const [replays, setReplays] = useState<Record<string, string | null>>({});

  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameBoxRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef<{ promise: Promise<void>; resolve: () => void } | null>(null);
  const runRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const htmlRef = useRef("");
  const pendingRef = useRef("");
  const startedRef = useRef(false);
  const revealedRef = useRef(false);
  const scanUntilRef = useRef(0);
  const liveThoughtRef = useRef(false);
  const t0Ref = useRef(0);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const replaysRef = useRef(replays);
  replaysRef.current = replays;
  const versionsRef = useRef(versions);
  versionsRef.current = versions;
  const vIdxRef = useRef(vIdx);
  vIdxRef.current = vIdx;

  const expectLoadRef = useRef(true);
  const loadSeqRef = useRef(0);
  const newReady = () => {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => (resolve = r));
    readyRef.current = { promise, resolve };
  };
  if (!readyRef.current && typeof window !== "undefined") newReady();

  const busy = phase === "thinking" || phase === "building";
  const busyRef = useRef(busy);
  busyRef.current = busy;
  const current = vIdx >= 0 ? versions[vIdx] : null;

  // ---------- setup ----------
  useEffect(() => setSettings(loadSettings()), []);
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow || !e.data?.__smedjan) return;
      if (e.data.type === "preview-ready") {
        readyRef.current?.resolve();
        if (expectLoadRef.current) expectLoadRef.current = false;
        else {
          // The generated app navigated its own frame (e.g. a form submit): put it back.
          const v = versionsRef.current[vIdxRef.current];
          if (v && !busyRef.current) frameRef.current?.contentWindow?.postMessage({ __smedjan: true, type: "load", html: v.html }, "*");
        }
      }
      if (e.data.type === "pong") readyRef.current?.resolve();
      if (e.data.type === "preview-error") console.warn("[preview]", e.data.message);
    };
    window.addEventListener("message", onMsg);
    // The frame may have loaded before this listener existed; ask it directly.
    frameRef.current?.contentWindow?.postMessage({ __smedjan: true, type: "ping" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Preload every cached build so a dead network mid-demo still has a fallback.
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SKETCHES.map(async (s) => {
        const res = await fetch(sketchReplay(s.id)).catch(() => null);
        const html = res?.ok ? await res.text() : null;
        return [s.id, html && html.includes("<") ? html : null] as const;
      }),
    ).then((entries) => !cancelled && setReplays(Object.fromEntries(entries)));
    SKETCHES.forEach((s) => (new Image().src = sketchImage(s.id)));
    return () => {
      cancelled = true;
    };
  }, []);

  // Clock + code ticker while a build runs.
  useEffect(() => {
    if (!busy) return;
    const iv = setInterval(() => {
      setElapsed((performance.now() - t0Ref.current) / 1000);
      const html = htmlRef.current;
      setLines(html ? html.split("\n").length : 0);
      if (settingsRef.current.code) setCodeTail(html.slice(-4000));
    }, 100);
    return () => clearInterval(iv);
  }, [busy]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2600);
    return () => clearTimeout(t);
  }, [flash]);

  // Leaving browser fullscreen (Esc) also leaves presentation mode.
  useEffect(() => {
    const onFs = () => !document.fullscreenElement && setPresenting(false);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const post = useCallback(async (msg: Record<string, unknown>) => {
    await readyRef.current?.promise;
    frameRef.current?.contentWindow?.postMessage({ __smedjan: true, ...msg }, "*");
  }, []);

  // Every build gets a freshly loaded frame, so top-level bindings from the
  // previous app's scripts can't collide with the next one.
  const reloadPreview = useCallback(() => {
    newReady();
    expectLoadRef.current = true;
    if (frameRef.current) frameRef.current.src = `/preview.html?v=${++loadSeqRef.current}`;
  }, []);

  // ---------- engine ----------
  const resetBuild = () => {
    htmlRef.current = "";
    pendingRef.current = "";
    startedRef.current = false;
    revealedRef.current = false;
  };

  const write = useCallback(
    (chunk: string, how: Via) => {
      let s = chunk;
      if (!startedRef.current) {
        // Drop anything before the first tag (e.g. a stray ```html fence).
        pendingRef.current += chunk;
        const i = pendingRef.current.indexOf("<");
        if (i < 0) return;
        s = pendingRef.current.slice(i);
        startedRef.current = true;
        reloadPreview();
        post({ type: "begin" });
        setVia(how);
        if (performance.now() >= scanUntilRef.current) setThought("Skriver designen…");
      }
      htmlRef.current += s;
      // Keep the reading overlay up while only <head>/CSS streams; reveal once the page body starts.
      if (!revealedRef.current && /<body[\s>]/i.test(htmlRef.current.slice(-s.length - 6))) {
        revealedRef.current = true;
        const run = runRef.current;
        const wait = Math.max(0, scanUntilRef.current - performance.now());
        setTimeout(() => run === runRef.current && setPhase((p) => (p === "thinking" ? "building" : p)), wait);
      }
      post({ type: "chunk", html: s });
    },
    [post, reloadPreview],
  );

  const replay = useCallback(
    async (html: string, alive: () => boolean) => {
      setVia("replay");
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
      const bodyAt = html.search(/<body[\s>]/i);
      let i = 0;
      while (i < html.length) {
        if (!alive()) throw new Stopped();
        if (i >= bodyAt && performance.now() < scanUntilRef.current) {
          await new Promise((r) => setTimeout(r, scanUntilRef.current - performance.now()));
          if (!alive()) throw new Stopped();
        }
        const boost = bodyAt > 0 && i < bodyAt ? HEAD_SPEEDUP : 1;
        const per = settingsRef.current.speed * 0.03 * boost * (0.6 + Math.random() * 0.8);
        let end = Math.min(html.length, i + Math.max(4, Math.round(per)));
        // Pause briefly on line ends now and then, like a real stream.
        const nl = html.indexOf("\n", i);
        if (nl > i && nl < end && Math.random() < 0.3) end = nl + 1;
        write(html.slice(i, end), "replay");
        i = end;
        await new Promise((r) => setTimeout(r, 30));
      }
    },
    [write],
  );

  const live = useCallback(
    async (payload: Payload, alive: () => boolean, canFallBack: boolean) => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      let deadline = 0;
      const arm = (ms: number) => (deadline = performance.now() + (canFallBack ? ms : Math.max(ms, 90_000)));
      arm(FIRST_EVENT_MS);
      const dog = setInterval(() => {
        if (performance.now() > deadline) ctrl.abort(new Error("Ingen respons från AI-tjänsten"));
      }, 250);

      try {
        const res = await fetch("/api/build", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
        if (res.status === 401) {
          window.location.href = "/login";
          throw new Stopped();
        }
        if (!res.ok || !res.body) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Serverfel (${res.status})`);
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let buf = "";
        let finished = false;
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          if (!alive()) throw new Stopped();
          buf += dec.decode(value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (!line.trim()) continue;
            const ev = JSON.parse(line) as { t: string; d?: string; msg?: string; stop?: string };
            if (ev.t === "start") {
              arm(FIRST_HTML_MS);
            } else if (ev.t === "think") {
              if (!liveThoughtRef.current) setThought("");
              liveThoughtRef.current = true;
              setThought((p) => (p + ev.d).replace(/\s+/g, " ").slice(-300));
            } else if (ev.t === "html") {
              arm(STALL_MS);
              write(ev.d ?? "", "live");
            } else if (ev.t === "error") {
              throw new Error(ev.msg || "Okänt fel");
            } else if (ev.t === "done") {
              finished = true;
              if (ev.stop === "max_tokens") setToast("Appen blev för lång och kapades i slutet");
            }
          }
        }
        if (!finished) throw new Error("Anslutningen bröts");
        if (!startedRef.current) throw new Error("Tomt svar");
      } catch (err) {
        if (!alive()) throw new Stopped();
        if (ctrl.signal.aborted && ctrl.signal.reason instanceof Error) throw ctrl.signal.reason;
        throw err;
      } finally {
        clearInterval(dog);
      }
    },
    [write],
  );

  const forge = useCallback(
    async (src: Source, payload: () => Promise<Payload>, opts: { replayHtml?: string | null; label: string; slug: string }) => {
      const run = ++runRef.current;
      abortRef.current?.abort();
      const alive = () => run === runRef.current;
      const mode: Mode = liveAvailable ? settingsRef.current.mode : "replay";
      const fallback = mode !== "live" ? opts.replayHtml ?? null : null;

      resetBuild();
      setSource(src);
      setPhase("thinking");
      setVia(null);
      setThought("");
      setLines(0);
      setCodeTail("");
      setElapsed(0);
      setShowSettings(false);
      t0Ref.current = performance.now();
      liveThoughtRef.current = false;
      setRunKey((k) => k + 1);
      const scans = src.kind === "sketch" || src.kind === "upload";
      scanUntilRef.current = t0Ref.current + (scans ? SCAN_MS : 0);
      if (scans) {
        setThought("Skannar ritningen…");
        setTimeout(() => {
          if (alive() && !liveThoughtRef.current) setThought("Läser av rum, mått och möbler…");
        }, SCAN_MS / 2);
      }

      if (!liveAvailable && !fallback) return;

      try {
        if (mode === "replay" && fallback) {
          await replay(fallback, alive);
        } else {
          try {
            await live(await payload(), alive, !!fallback);
          } catch (err) {
            if (err instanceof Stopped || !fallback) throw err;
            console.warn("[forge] live failed, replaying cache:", err);
            resetBuild();
            setThought("");
            setPhase("thinking");
            await replay(fallback, alive);
          }
        }
        // Never cut the scanner sweep short, even if a build arrives very fast.
        const left = scanUntilRef.current - performance.now();
        if (left > 0) await new Promise((r) => setTimeout(r, left));
        if (!alive()) return;
        post({ type: "end" });
        const secs = (performance.now() - t0Ref.current) / 1000;
        const n = htmlRef.current.split("\n").length;
        setElapsed(secs);
        setLines(n);
        setFlash(`Klar på ${secs.toFixed(1).replace(".", ",")} s · ${n} rader kod`);
        setCodeTail(htmlRef.current.slice(-4000));
        const version = { html: htmlRef.current, label: opts.label, slug: opts.slug };
        const next = [...versionsRef.current.slice(0, vIdxRef.current + 1), version];
        setVersions(next);
        setVIdx(next.length - 1);
        setPhase("done");
      } catch (err) {
        if (!alive() || err instanceof Stopped) return;
        console.error("[forge]", err);
        setPhase("error");
        setToast(err instanceof Error ? err.message : "Något gick fel");
        const prev = versionsRef.current[vIdxRef.current];
        if (prev) {
          reloadPreview();
          post({ type: "load", html: prev.html });
        } else if (startedRef.current) post({ type: "end" });
      }
    },
    [live, post, replay, reloadPreview, liveAvailable],
  );

  const stop = useCallback(() => {
    if (!busy) return;
    runRef.current++;
    abortRef.current?.abort();
    if (startedRef.current) {
      post({ type: "end" });
      const version = { html: htmlRef.current, label: "Avbruten", slug: "avbruten" };
      const next = [...versionsRef.current.slice(0, vIdxRef.current + 1), version];
      setVersions(next);
      setVIdx(next.length - 1);
      setPhase("done");
    } else {
      const prev = versionsRef.current[vIdxRef.current];
      setPhase(prev ? "done" : "idle");
    }
  }, [busy, post]);

  // ---------- actions ----------
  const forgeSketch = useCallback(
    (sketch: Sketch) =>
      forge(
        { kind: "sketch", sketch },
        async () => {
          const blob = await (await fetch(sketchImage(sketch.id))).blob();
          return {
            kind: "image",
            image: { data: await blobToBase64(blob), mediaType: "image/jpeg" },
            title: sketch.title,
            note: sketch.brief,
          };
        },
        { replayHtml: replaysRef.current[sketch.id], label: sketch.title, slug: slugify(sketch.title) },
      ),
    [forge],
  );

  const forgeUpload = useCallback(
    async (file: File) => {
      if (!liveAvailable) return;
      if (!file.type.startsWith("image/")) return setToast("Det där är ingen bild");
      let url: string;
      try {
        url = await fileToJpeg(file);
      } catch {
        return setToast("Kunde inte läsa bilden");
      }
      forge(
        { kind: "upload", url, name: file.name },
        async () => ({ kind: "image", image: { data: url.slice(url.indexOf(",") + 1), mediaType: "image/jpeg" } }),
        { label: file.name || "Bild", slug: slugify(file.name.replace(/\.[^.]+$/, "")) },
      );
    },
    [forge, liveAvailable],
  );

  const forgeText = useCallback(() => {
    const p = prompt.trim();
    if (!p || busy) return;
    forge({ kind: "text", prompt: p }, async () => ({ kind: "text", prompt: p }), {
      label: p.length > 40 ? p.slice(0, 40) + "…" : p,
      slug: slugify(p.split(/\s+/).slice(0, 4).join(" ")),
    });
  }, [prompt, busy, forge]);

  const forgeEdit = useCallback(() => {
    const p = edit.trim();
    const base = versionsRef.current[vIdxRef.current];
    if (!p || !base || busy) return;
    setEdit("");
    forge({ kind: "edit", prompt: p }, async () => ({ kind: "edit", html: base.html, prompt: p }), {
      label: `Ändring: ${p.length > 30 ? p.slice(0, 30) + "…" : p}`,
      slug: base.slug,
    });
  }, [edit, busy, forge]);

  const showVersion = useCallback(
    (i: number) => {
      const v = versionsRef.current[i];
      if (!v || busy) return;
      setVIdx(i);
      setFlash(null);
      setCodeTail(v.html.slice(-4000));
      setLines(v.html.split("\n").length);
      reloadPreview();
      post({ type: "load", html: v.html });
    },
    [busy, post, reloadPreview],
  );

  const download = useCallback(() => {
    if (!current) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([current.html], { type: "text/html" }));
    a.download = `${current.slug}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, [current]);

  const reforge = useCallback(() => {
    if (busy || !source) return;
    if (source.kind === "sketch") forgeSketch(source.sketch);
    else if (source.kind === "text") forge(source, async () => ({ kind: "text", prompt: source.prompt }), { label: source.prompt.slice(0, 40), slug: slugify(source.prompt) });
  }, [busy, source, forge, forgeSketch]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => null);
    window.location.href = "/login";
  };

  // ---------- keyboard, paste, drop ----------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable;
      if (e.key === "Escape") {
        if (busy) stop();
        else setShowSettings(false);
        (document.activeElement as HTMLElement)?.blur?.();
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = KEYS.indexOf(e.key);
      if (k >= 0 && visible[k] && !busy) {
        e.preventDefault();
        forgeSketch(visible[k]);
      } else if (e.key === "p") setPresenting((v) => !v);
      else if (e.key === "f") {
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else {
          setPresenting(true);
          document.documentElement.requestFullscreen?.().catch(() => {});
        }
      }
      else if (e.key === "c") setSettings((s) => ({ ...s, code: !s.code }));
      else if (e.key === "e") {
        e.preventDefault();
        document.getElementById("edit-input")?.focus();
      } else if (liveAvailable && e.key === "ArrowLeft") showVersion(vIdxRef.current - 1);
      else if (liveAvailable && e.key === "ArrowRight") showVersion(vIdxRef.current + 1);
    };
    const onPaste = (e: ClipboardEvent) => {
      if (!liveAvailable) return;
      const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
      if (file && !busy) {
        e.preventDefault();
        forgeUpload(file);
      }
    };
    let depth = 0;
    const hasFile = (e: DragEvent) => liveAvailable && Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const onEnter = (e: DragEvent) => {
      if (!hasFile(e)) return;
      depth++;
      setDragging(true);
    };
    const onLeave = (e: DragEvent) => {
      if (!hasFile(e)) return;
      if (--depth <= 0) setDragging(false);
    };
    const onOver = (e: DragEvent) => hasFile(e) && e.preventDefault();
    const onDrop = (e: DragEvent) => {
      if (!hasFile(e)) return;
      e.preventDefault();
      depth = 0;
      setDragging(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && !busy) forgeUpload(file);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("paste", onPaste);
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("dragover", onOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [busy, stop, forgeSketch, forgeUpload, showVersion, visible, liveAvailable]);

  // ---------- render ----------
  const grouped = useMemo(() => {
    const g = new Map<string, { sketch: Sketch; key: string }[]>();
    visible.forEach((sketch, i) => {
      if (!g.has(sketch.category)) g.set(sketch.category, []);
      g.get(sketch.category)!.push({ sketch, key: KEYS[i] });
    });
    return [...g.entries()];
  }, [visible]);

  const phaseLabel: Record<Phase, string> = {
    idle: "Redo",
    thinking:
      source?.kind === "edit"
        ? "Funderar på ändringen…"
        : source?.kind === "text"
          ? "Tolkar idén…"
          : "Läser planritningen…",
    building: "Smider…",
    done: "Klar",
    error: "Något gick fel",
  };
  const slug = busy ? (source?.kind === "sketch" ? slugify(source.sketch.title) : current?.slug ?? "ny-app") : current?.slug;
  const sourceImage = source?.kind === "sketch" ? sketchImage(source.sketch.id) : source?.kind === "upload" ? source.url : null;
  const sourceText = source?.kind === "text" || source?.kind === "edit" ? source.prompt : null;
  const activeSketch = source?.kind === "sketch" ? source.sketch.id : null;

  return (
    <div className={`app${presenting ? " presenting" : ""}`}>
      <header className="topbar">
        <div className="brand">
          <I.Anvil />
          Smedjan
          <small>från ritning till bostad</small>
        </div>
        <div className="spacer" />
        <div className="status" aria-live="polite">
          <span className={`dot ${phase}`} />
          <b>{phaseLabel[phase]}</b>
          {phase !== "idle" && (
            <>
              <span className="sep" />
              <span>{elapsed.toFixed(1).replace(".", ",")} s</span>
              <span className="sep hide-sm" />
              <span className="hide-sm">{lines} rader</span>
            </>
          )}
          {via && <span className={`via ${via}`} title={via === "live" ? "Live" : "Repris"} />}
        </div>
        <div className="spacer" />
        {busy && (
          <button className="icon-btn" onClick={stop} title="Stoppa (Esc)">
            <I.Stop /> Stoppa
          </button>
        )}
        <button className={`icon-btn${settings.code ? " on" : ""}`} onClick={() => setSettings((s) => ({ ...s, code: !s.code }))} title="Visa kod (C)">
          <I.Code />
        </button>
        <button className="icon-btn" onClick={() => setPresenting((v) => !v)} title="Presentationsläge (P)">
          {presenting ? <I.Shrink /> : <I.Expand />}
        </button>
        <button className={`icon-btn${showSettings ? " on" : ""}`} onClick={() => setShowSettings((v) => !v)} title="Inställningar">
          <I.Gear />
        </button>
        {gate && (
          <button className="icon-btn" onClick={logout} title="Logga ut">
            <I.Logout />
          </button>
        )}
        {showSettings && (
          <div className="popover" role="dialog" aria-label="Inställningar">
            {liveAvailable && (
            <div>
              <label>Byggläge</label>
              <div className="seg">
                {(["auto", "live", "replay"] as Mode[]).map((m) => (
                  <button key={m} className={settings.mode === m ? "on" : ""} onClick={() => setSettings((s) => ({ ...s, mode: m }))}>
                    {m === "auto" ? "Auto" : m === "live" ? "Bara live" : "Repris"}
                  </button>
                ))}
              </div>
            </div>
            )}
            {liveAvailable && (
            <p className="note">
              {settings.mode === "auto"
                ? "Bygger live. Om AI:n inte svarar eller nätet strular spelas en förinspelad version upp automatiskt."
                : settings.mode === "live"
                  ? "Alltid live, ingen reserv."
                  : "Spelar upp förinspelade byggen för bostäderna. Fritext och ändringar går fortfarande live."}
            </p>
            )}
            <div>
              <label>
                {liveAvailable ? "Repris-hastighet" : "Bygghastighet"} · {settings.speed.toLocaleString("sv-SE")} tecken/s
              </label>
              <input type="range" min={300} max={12000} step={100} value={settings.speed} onChange={(e) => setSettings((s) => ({ ...s, speed: Number(e.target.value) }))} />
            </div>
            <div className="row">
              <span>Visa koden medan den skrivs</span>
              <button className={`toggle${settings.code ? " on" : ""}`} onClick={() => setSettings((s) => ({ ...s, code: !s.code }))} aria-label="Visa kod" />
            </div>
            <p className="note version">Version {version}</p>
          </div>
        )}
      </header>

      <aside className="sidebar">
        {grouped.map(([cat, items]) => (
          <section key={cat}>
            <h3>{cat}</h3>
            <div className="sketch-grid">
              {items.map(({ sketch, key }) => (
                <button
                  key={sketch.id}
                  className={`sketch${activeSketch === sketch.id ? " active" : ""}`}
                  onClick={() => !busy && forgeSketch(sketch)}
                  disabled={busy}
                  title={`${sketch.title} (${key})`}
                >
                  <img src={sketchImage(sketch.id)} alt="" loading="eager" />
                  <span className="label">
                    {sketch.title}
                    <kbd>{key}</kbd>
                  </span>
                  {sketch.subtitle && <span className="sub">{sketch.subtitle}</span>}
                  {replays[sketch.id] && <span className="cached" />}
                </button>
              ))}
            </div>
          </section>
        ))}

        {liveAvailable && (
        <section className="composer">
          <h3>Eller beskriv en idé</h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="T.ex. en budgetplanerare för ett litet aktiebolag med diagram…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) forgeText();
            }}
          />
          <div className="ideas">
            {PROMPT_IDEAS.map((idea) => (
              <button key={idea} className="idea" onClick={() => setPrompt(idea)} title={idea}>
                {idea}
              </button>
            ))}
          </div>
          <button className="btn-forge" onClick={forgeText} disabled={busy || !prompt.trim()}>
            <I.Hammer /> Smid
          </button>
          <p className="hint">
            Du kan också släppa eller klistra in en egen bild var som helst. <kbd>⌘</kbd>+<kbd>↵</kbd> smider.
          </p>
        </section>
        )}
      </aside>

      <main className="stage">
        <Sparks active={phase === "building"} target={frameBoxRef} />
        <div ref={frameBoxRef} className={`frame${busy ? " hot" : ""}`}>
          <div className="frame-bar">
            <i />
            <i />
            <i />
            <div className="url">
              <I.Lock />
              smedjan.app/{slug ?? ""}
            </div>
            <div className="actions">
              {phase === "done" && source && (source.kind === "sketch" || source.kind === "text") && (
                <button className="icon-btn" onClick={reforge} title="Smid igen">
                  <I.Redo />
                </button>
              )}
              {current && !busy && (
                <button className="icon-btn" onClick={download} title="Ladda ner HTML">
                  <I.Download />
                </button>
              )}
            </div>
          </div>
          <div className="frame-body">
            <iframe ref={frameRef} src="/preview.html" sandbox="allow-scripts allow-forms" title="Förhandsvisning" />

            <div className={`overlay${phase === "idle" || (phase === "error" && !current) ? "" : " hide"}`}>
              <div className="hero">
                <I.Anvil />
                <h1>
                  Välj en bostad.
                  <br />
                  <em>Se den byggas.</em>
                </h1>
                <p>
                  {liveAvailable
                    ? "Klicka på en handritad planritning, så byggs bostaden i 3D framför dina ögon. Du kan också beskriva en egen idé."
                    : "Klicka på en handritad planritning, så byggs bostaden i 3D framför dina ögon."}
                </p>
                <div className="keys">
                  <span><kbd>1</kbd>–<kbd>6</kbd>bostäder</span>
                  <span><kbd>F</kbd>helskärm</span>
                  <span><kbd>C</kbd>kod</span>
                  {liveAvailable && <span><kbd>E</kbd>ändra</span>}
                  <span><kbd>Esc</kbd>stoppa</span>
                </div>
              </div>
            </div>

            <div className={`overlay${phase === "thinking" ? "" : " hide"}`}>
              <div className="reading">
                {sourceImage ? (
                  <div className="subject" key={runKey}>
                    <img src={sourceImage} alt="" />
                    <div className="scan-grid" />
                    <div className="beam" style={{ animationDuration: `${SCAN_MS / 2}ms` }} />
                    <i className="corner tl" />
                    <i className="corner tr" />
                    <i className="corner bl" />
                    <i className="corner br" />
                  </div>
                ) : (
                  sourceText && <div className="quote">{sourceText}</div>
                )}
                <div className="thought">
                  <div className="spinner" />
                  <span>{thought || phaseLabel.thinking}</span>
                </div>
              </div>
            </div>

            {(phase === "building" || phase === "done") && sourceImage && (
              <div className={`pip${phase === "done" ? " small" : ""}`} key={sourceImage}>
                <img src={sourceImage} alt="" />
              </div>
            )}
            {phase === "building" && !sourceImage && sourceText && (
              <div className="pip text" key={sourceText}>
                {sourceText}
              </div>
            )}

            {flash && phase === "done" && (
              <div className="flash" key={flash}>
                <span>✓</span> {flash}
              </div>
            )}

            {settings.code && (busy || phase === "done") && (
              <div className="code" aria-hidden>
                <pre>
                  {codeTail}
                  {busy && <span className="caret" />}
                </pre>
              </div>
            )}
          </div>
        </div>

        {liveAvailable && (
        <div className="dock">
          {liveAvailable && (
          <div className={`edit${!current || busy ? " disabled" : ""}`}>
            <I.Wand />
            <input
              id="edit-input"
              value={edit}
              onChange={(e) => setEdit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && forgeEdit()}
              placeholder={current ? "Ändra något… t.ex. ”gör den mörk” eller ”lägg till ett diagram”" : "Bygg något först, sedan kan du ändra det här"}
              disabled={!current || busy}
            />
            <button className="btn-forge" onClick={forgeEdit} disabled={!current || busy || !edit.trim()}>
              Ändra
            </button>
          </div>
          )}
          {liveAvailable && versions.length > 1 && (
            <div className="versions">
              <button className="icon-btn" onClick={() => showVersion(vIdx - 1)} disabled={busy || vIdx <= 0} title="Föregående version (←)">
                <I.Left />
              </button>
              <span>
                v{vIdx + 1}/{versions.length}
              </span>
              <button className="icon-btn" onClick={() => showVersion(vIdx + 1)} disabled={busy || vIdx >= versions.length - 1} title="Nästa version (→)">
                <I.Right />
              </button>
            </div>
          )}
        </div>
        )}
      </main>

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}
      {dragging && <div className="dropzone">Släpp bilden för att smida den</div>}
    </div>
  );
}
