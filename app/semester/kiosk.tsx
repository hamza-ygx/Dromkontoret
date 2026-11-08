"use client";

import { geoInterpolate } from "d3-geo";
import { useEffect, useRef, useState } from "react";
import { SPOTS } from "@/lib/semester/spots";
import { DESTS } from "@/lib/semester/catalog";
import { Mark } from "../designer/designer";
import { clamp, ease, fitCanvas, paintBase, paintDot, paintPlane, paintRoute, projection, type LonLat } from "./globe-paint";

const HOME: LonLat = [17.92, 59.65];
const TARGETS = DESTS.filter((d) => d.id !== "sverige").flatMap((d) => (["beach", "city"] as const).map((k) => ({ at: [SPOTS[d.id][k].lon, SPOTS[d.id][k].lat] as LonLat, label: d[k].name })));

function AttractGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0, next = 0, order = Math.floor(Math.random() * TARGETS.length);
    const arcs: { route: (t: number) => LonLat; to: LonLat; label: string; born: number }[] = [];
    const ro = new ResizeObserver(() => ({ w, h } = fitCanvas(canvas, wrap)));
    ro.observe(wrap);
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      if (w && h) {
        if (now > next) {
          order = (order + 7) % TARGETS.length;
          const target = TARGETS[order];
          arcs.push({ route: geoInterpolate(HOME, target.at), to: target.at, label: target.label, born: now });
          if (arcs.length > 3) arcs.shift();
          next = now + 2600;
        }
        const center: LonLat = [22 + 55 * Math.sin(t * 0.09), 28 + 8 * Math.sin(t * 0.13)];
        const base = Math.min(w * 0.46, h * 0.36);
        const proj = projection(center, base, w / 2, h * 0.58);
        const path = paintBase(ctx, proj, w, h, base);
        paintDot(ctx, proj, center, HOME, "#14213a", "Stockholm", false);
        for (const a of arcs) {
          const age = (now - a.born) / 1000;
          const head = ease(clamp(age / 2.2, 0, 1));
          const alpha = clamp(1 - (age - 4.5) / 1.5, 0, 1);
          if (alpha <= 0) continue;
          paintRoute(ctx, path, a.route, head, alpha);
          if (head < 1) paintPlane(ctx, proj, a.route, head, 22, "#c8a45c");
          else paintDot(ctx, proj, center, a.to, "#c8a45c", a.label, true, alpha);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="globe" ref={wrapRef}>
      <canvas ref={canvasRef} aria-hidden />
    </div>
  );
}

export function Attract({ onStart }: { onStart: () => void }) {
  return (
    <button className="attract" onClick={onStart} aria-label="Tryck för att börja planera din drömsemester">
      <AttractGlobe />
      <span className="at-top">
        <Mark />
      </span>
      <span className="at-copy">
        <em>Revisionskonsulterna J Hägglund presenterar</em>
        <b>Drömsemestern</b>
        <span>Vart räcker semesterkassan?</span>
        <i className="at-cta">Tryck för att börja</i>
      </span>
    </button>
  );
}

export function useIdle(active: boolean, ms: number, onIdle: () => void) {
  const cb = useRef(onIdle);
  cb.current = onIdle;
  useEffect(() => {
    if (!active) return;
    let timer = window.setTimeout(() => cb.current(), ms);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => cb.current(), ms);
    };
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [active, ms]);
}

export function StillHere({ seconds, onStay, onLeave }: { seconds: number; onStay: () => void; onLeave: () => void }) {
  const [left, setLeft] = useState(seconds);
  const leave = useRef(onLeave);
  leave.current = onLeave;
  useEffect(() => {
    const iv = window.setInterval(() => setLeft((s) => s - 1), 1000);
    return () => window.clearInterval(iv);
  }, []);
  useEffect(() => {
    if (left <= 0) leave.current();
  }, [left]);
  return (
    <div className="stillhere" onPointerDown={onStay}>
      <div role="alertdialog" aria-live="assertive">
        <b>Är du kvar?</b>
        <p>Resan startar om om {Math.max(0, left)} sekunder.</p>
        <button className="build" onClick={onStay}>
          Ja, jag är kvar
        </button>
      </div>
    </div>
  );
}
