"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Box, Item, Model3D, WallRun } from "@/lib/home/types";

const M = 40; // px per metre in the model
const WALL_H = 2.6;

// ---------- colour helpers ----------
function hexToRgb(c: string): [number, number, number] {
  if (c.startsWith("#")) {
    const n = parseInt(c.slice(1), 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  const m = c.match(/\d+/g)!.map(Number);
  return [m[0], m[1], m[2]];
}
const shade = (c: string, k: number) => {
  const [r, g, b] = hexToRgb(c);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
};
// Fixed sun from the south-east: each side of a box keeps its own brightness.
const LIGHT = { top: 1, n: 0.7, s: 0.9, e: 0.82, w: 0.64 };

// ---------- primitives ----------
const px = (m: number) => `${(m * M).toFixed(1)}px`;

function Faces({ b, top }: { b: Box; top?: string }) {
  const W = b.w * M, D = b.d * M, H = b.h * M;
  const glass = b.glass;
  const col = (k: number) => (glass ? undefined : shade(b.color, k));
  const cls = glass ? "f glass" : "f";
  if (b.round) {
    const r = Math.min(W, D) / 2;
    const sides = 10;
    const sw = 2 * r * Math.tan(Math.PI / sides) + 0.6;
    return (
      <>
        {!b.flat &&
          Array.from({ length: sides }, (_, i) => {
            const a = (i * 360) / sides;
            const k = 0.78 + 0.16 * Math.cos(((a - 135) * Math.PI) / 180);
            return (
              <i
                key={i}
                className={cls}
                style={{ left: W / 2 - sw / 2, top: D / 2, width: sw, height: H, background: col(k), transformOrigin: "50% 0", transform: `rotateZ(${a}deg) translateY(${(r * Math.cos(Math.PI / sides)).toFixed(1)}px) rotateX(90deg)` }}
              />
            );
          })}
        <i className={`${cls} top round`} style={{ inset: 0, background: top ?? col(LIGHT.top), transform: `translateZ(${H.toFixed(1)}px)` }} />
      </>
    );
  }
  return (
    <>
      {!b.flat && (
        <>
          <i className={cls} style={{ left: 0, top: 0, width: W, height: H, background: col(LIGHT.n), transformOrigin: "0 0", transform: "rotateX(90deg)" }} />
          <i className={cls} style={{ left: 0, top: D, width: W, height: H, background: col(LIGHT.s), transformOrigin: "0 0", transform: "rotateX(90deg)" }} />
          <i className={cls} style={{ left: 0, top: 0, width: H, height: D, background: col(LIGHT.w), transformOrigin: "0 0", transform: "rotateY(-90deg)" }} />
          <i className={cls} style={{ left: W, top: 0, width: H, height: D, background: col(LIGHT.e), transformOrigin: "0 0", transform: "rotateY(-90deg)" }} />
        </>
      )}
      <i className={`${cls} top`} style={{ inset: 0, background: top ?? col(LIGHT.top), transform: `translateZ(${H.toFixed(1)}px)` }} />
    </>
  );
}

function BoxEl({ b, delay, top }: { b: Box; delay?: number; top?: string }) {
  return (
    <div className={`bx ${b.className ?? ""}`} style={{ left: px(b.x), top: px(b.y), width: px(b.w), height: px(b.d), transform: `translateZ(${px(b.z)})` }}>
      <div className="an" style={delay !== undefined ? { animationDelay: `${delay.toFixed(2)}s` } : undefined}>
        <Faces b={b} top={top} />
      </div>
    </div>
  );
}

// ---------- walls ----------
function wallBoxes(run: WallRun, color: string): Box[] {
  const t = run.exterior ? 0.22 : 0.11;
  const out: Box[] = [];
  const seg = (a: number, b: number, z: number, h: number, glass = false) => {
    if (b - a < 0.01) return;
    const tt = glass ? 0.05 : t;
    if (run.axis === "h") out.push({ x: a, y: run.at - tt / 2, z, w: b - a, d: tt, h, color: glass ? "#bcd7e6" : color, glass });
    else out.push({ x: run.at - tt / 2, y: a, z, w: tt, d: b - a, h, color: glass ? "#bcd7e6" : color, glass });
  };
  const ops = [...run.openings].sort((p, q) => p.a - q.a);
  let cur = run.from;
  for (const o of ops) {
    seg(cur, o.a, 0, WALL_H);
    if (o.kind === "window") {
      seg(o.a, o.b, 0, 0.9);
      seg(o.a, o.b, 0.9, 1.2, true);
      seg(o.a, o.b, 2.1, WALL_H - 2.1);
    } else if (o.kind === "glassdoor") {
      seg(o.a, o.b, 0, 2.2, true);
      seg(o.a, o.b, 2.2, WALL_H - 2.2);
    } else {
      const top = o.kind === "opening" ? 2.25 : 2.1;
      seg(o.a, o.b, top, WALL_H - top);
    }
    cur = o.b;
  }
  seg(cur, run.to, 0, WALL_H);
  return out;
}

// ---------- the static model (memoised: only re-renders when the plan changes) ----------
export interface WallPalette {
  wall: string;
  wallTop: string;
}

const Model = memo(function Model({ plan, pal, quick }: { plan: Model3D; pal: WallPalette; quick: boolean }) {
  // Full build: blueprint (1s) → walls rise → furniture drops. Quick rebuild: ~1s total.
  const wallBase = quick ? 0 : 1.05, wallStagger = quick ? 0.25 : 1.0;
  const itemBase = quick ? 0.2 : 2.1, itemStagger = quick ? 0.55 : 1.9;
  const runs = plan.walls;
  const late = (b: Box) => !(b.z < 0 || b.className?.includes("floor") || b.className?.includes("lawn") || b.className?.includes("lake"));
  const siteEarly = plan.site.filter((b) => !late(b));
  const siteLate = plan.site.filter(late);
  return (
    <>
      {siteEarly.map((b, i) => (
        <BoxEl key={`se${i}`} b={b} delay={quick ? undefined : 0.05 + (i / Math.max(1, siteEarly.length)) * 0.6} />
      ))}
      {plan.rooms.map((r) => (
        <div key={r.id} className="room-hit" data-room={r.id} style={{ left: px(r.x), top: px(r.y), width: px(r.w), height: px(r.d) }} />
      ))}
      {runs.map((run, i) => (
        <div key={run.id} className={`wr ${run.side}`} data-side={run.side}>
          {wallBoxes(run, pal.wall).map((b, j) => (
            <BoxEl key={j} b={b} delay={wallBase + (i / Math.max(1, runs.length - 1)) * wallStagger} top={b.glass ? undefined : pal.wallTop} />
          ))}
        </div>
      ))}
      {siteLate.map((b, i) => (
        <div key={`sl${i}`} className="late">
          <BoxEl b={b} delay={itemBase + (i / Math.max(1, siteLate.length)) * itemStagger * 0.8} />
        </div>
      ))}
      {plan.items.map((it, i) => (
        <div key={it.id} className="it" data-item={it.id}>
          {it.boxes.map((b, j) => (
            <BoxEl key={j} b={b} delay={itemBase + (i / Math.max(1, plan.items.length)) * itemStagger} />
          ))}
        </div>
      ))}
    </>
  );
});

// ---------- scene with camera ----------
export interface SceneHandle {
  focusItem: (id: string | null) => void;
}

const DEFAULT = { rx: 57, rz: -32, zoom: 1 };

export function Scene({
  plan,
  palette,
  buildId,
  quick,
  active = true,
  selectedItem,
  selectedRoom,
  onSelectItem,
  onSelectRoom,
}: {
  plan: Model3D;
  palette: WallPalette;
  buildId: number;
  quick: boolean;
  active?: boolean;
  selectedItem: string | null;
  selectedRoom: string | null;
  onSelectItem: (id: string | null) => void;
  onSelectRoom: (id: string | null) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cam = useRef({ ...DEFAULT });
  const target = useRef({ ...DEFAULT });
  const fit = useRef(1);
  const idleUntil = useRef(0);
  const flat = useRef(false);
  const dirty = useRef(true);
  const [phase, setPhase] = useState(quick ? 3 : 0);
  const [is2d, setIs2d] = useState(false);
  const [spin, setSpin] = useState(true);
  const spinRef = useRef(true);
  spinRef.current = spin;
  const activeRef = useRef(active);
  activeRef.current = active;
  const [pop, setPop] = useState<{ item: Item; x: number; y: number } | null>(null);

  const cx = plan.bounds.x + plan.bounds.w / 2;
  const cy = plan.bounds.y + plan.bounds.d / 2;

  // Fit the model to the stage.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      const bw = plan.bounds.w * M, bd = plan.bounds.d * M;
      fit.current = Math.min((width * 0.9) / Math.hypot(bw, bd), (height * 0.88) / (Math.hypot(bw, bd) * 0.58 + WALL_H * M));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [plan]);

  // Build choreography: blueprint → walls rise → furniture drops.
  useEffect(() => {
    dirty.current = true;
    if (quick) {
      setPhase(3);
      return;
    }
    setPhase(0);
    setIs2d(false);
    target.current = { rx: 0, rz: 0, zoom: 1 };
    cam.current = { rx: 0, rz: 0, zoom: 1 };
    flat.current = true;
    const t1 = setTimeout(() => {
      setPhase(1);
      flat.current = false;
      target.current = { ...DEFAULT, zoom: target.current.zoom };
    }, 1050);
    const t2 = setTimeout(() => setPhase(2), 2050);
    const t3 = setTimeout(() => setPhase(3), 4300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [buildId, quick]);

  // Camera loop: one direct transform per frame; walls/labels only when needed.
  useEffect(() => {
    let raf = 0, last = performance.now(), lastQuad = "", lastLabelRz = 999, lastLabelS = 0;
    const labels = () => worldRef.current?.querySelectorAll<HTMLElement>(".lbl") ?? [];
    const tick = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (!activeRef.current) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const c = cam.current, t = target.current;
      if (spinRef.current && !flat.current && now > idleUntil.current) t.rz += dt * 0.0085;
      const k = 1 - Math.exp(-dt / 140);
      c.rx += (t.rx - c.rx) * k;
      c.rz += (t.rz - c.rz) * k;
      c.zoom += (t.zoom - c.zoom) * k;
      const s = fit.current * c.zoom;
      if (worldRef.current) worldRef.current.style.transform = `scale3d(${s.toFixed(4)},${s.toFixed(4)},${s.toFixed(4)}) rotateX(${c.rx.toFixed(2)}deg) rotateZ(${c.rz.toFixed(2)}deg)`;
      // Lower the walls that face the camera (only on quadrant changes).
      const a = (c.rz * Math.PI) / 180, sn = Math.sin(a), cs = Math.cos(a);
      const tilt = c.rx > 25;
      const facing = { s: cs > 0.3, n: -cs > 0.3, e: sn > 0.3, w: -sn > 0.3 } as Record<string, boolean>;
      const quad = tilt ? Object.entries(facing).filter(([, v]) => v).map(([k]) => k).join("") + (Math.abs(cs) > 0.55 ? "H" : "") + (Math.abs(sn) > 0.55 ? "V" : "") : "flat";
      const fresh = dirty.current;
      dirty.current = false;
      if ((fresh || quad !== lastQuad) && worldRef.current) {
        lastQuad = quad;
        worldRef.current.querySelectorAll<HTMLElement>(".wr").forEach((el) => {
          const side = el.dataset.side!;
          const low = tilt && (facing[side] || (side === "ih" && quad.includes("H")) || (side === "iv" && quad.includes("V")));
          el.classList.toggle("lo", !!low);
        });
      }
      // Labels stay upright and readable whatever the zoom.
      const ls = Math.max(1, 0.95 / s);
      if (fresh || Math.abs(c.rz - lastLabelRz) > 0.4 || Math.abs(ls - lastLabelS) > 0.03) {
        lastLabelRz = c.rz;
        lastLabelS = ls;
        labels().forEach((l) => (l.style.transform = `translate(-50%,-50%) translateZ(110px) rotateZ(${(-c.rz).toFixed(1)}deg) scale(${ls.toFixed(2)})`));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Selection highlight + popover position.
  useEffect(() => {
    const w = worldRef.current;
    if (!w) return;
    w.querySelectorAll(".it.sel").forEach((e) => e.classList.remove("sel"));
    w.querySelectorAll(".room-hit.sel").forEach((e) => e.classList.remove("sel"));
    if (selectedRoom) w.querySelector(`.room-hit[data-room="${selectedRoom}"]`)?.classList.add("sel");
    if (!selectedItem) return setPop(null);
    const el = w.querySelector<HTMLElement>(`.it[data-item="${selectedItem}"]`);
    const item = plan.items.find((i) => i.id === selectedItem);
    if (!el || !item) return setPop(null);
    el.classList.add("sel");
    idleUntil.current = performance.now() + 15000;
    const place = () => {
      const tops = el.querySelectorAll(".top");
      const st = stageRef.current!.getBoundingClientRect();
      let x = 0, y = Infinity, n = 0;
      tops.forEach((t) => {
        const r = t.getBoundingClientRect();
        x += r.left + r.width / 2;
        y = Math.min(y, r.top);
        n++;
      });
      if (n) setPop({ item, x: x / n - st.left, y: y - st.top });
    };
    place();
    const iv = setInterval(place, 120);
    return () => clearInterval(iv);
  }, [selectedItem, selectedRoom, plan]);

  // ---------- input ----------
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".ctrl,.pop")) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
    d.moved = true;
    d.x = e.clientX;
    d.y = e.clientY;
    idleUntil.current = performance.now() + 9000;
    target.current.rz -= dx * 0.35;
    if (!flat.current) target.current.rx = Math.max(18, Math.min(80, target.current.rx - dy * 0.25));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved) return;
    const hit = document.elementsFromPoint(e.clientX, e.clientY);
    const itemEl = hit.map((h) => h.closest<HTMLElement>(".it")).find(Boolean);
    if (itemEl) return onSelectItem(itemEl.dataset.item!);
    const roomEl = hit.map((h) => h.closest<HTMLElement>(".room-hit")).find(Boolean);
    onSelectItem(null);
    onSelectRoom(roomEl ? roomEl.dataset.room! : null);
  };
  const onWheel = (e: React.WheelEvent) => {
    target.current.zoom = Math.max(0.5, Math.min(2.6, target.current.zoom * (e.deltaY > 0 ? 0.9 : 1.1)));
    idleUntil.current = performance.now() + 6000;
  };
  const set2d = (on: boolean) => {
    setIs2d(on);
    flat.current = on;
    target.current.rx = on ? 0 : DEFAULT.rx;
    if (on) target.current.rz = Math.round(target.current.rz / 360) * 360;
  };
  const reset = useCallback(() => {
    set2d(false);
    target.current = { ...DEFAULT, rz: DEFAULT.rz + Math.round((cam.current.rz - DEFAULT.rz) / 360) * 360 };
    setSpin(true);
    idleUntil.current = 0;
  }, []);

  const labels = useMemo(
    () =>
      plan.rooms
        .filter((r) => r.kind !== "hall" && r.w * r.d >= 2)
        .map((r) => (
          <div key={r.id} className={`lbl${r.w * r.d < 5 ? " sm" : ""}`} style={{ left: px(r.x + r.w / 2), top: px(r.y + r.d / 2) }}>
            <b>{r.name}</b>
            <span>{(r.w * r.d).toFixed(1).replace(".", ",").replace(",0", "")} m²</span>
          </div>
        )),
    [plan],
  );

  return (
    <div
      ref={stageRef}
      className={`scene p${phase}${is2d ? " is2d" : ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
    >
      <div className="world" ref={worldRef}>
        <div className={`plan ${quick ? "quick" : "full"}`} key={buildId} style={{ left: px(-cx), top: px(-cy) }}>
          <div className="ground" style={{ left: px(plan.bounds.x - 3), top: px(plan.bounds.y - 3), width: px(plan.bounds.w + 6), height: px(plan.bounds.d + 6) }} />
          <Model plan={plan} pal={palette} quick={quick} />
          {labels}
        </div>
      </div>
      {phase === 0 && <div className="sweep" />}
      <div className="ctrl">
        <button className={!is2d ? "on" : ""} onClick={() => set2d(false)}>3D</button>
        <button className={is2d ? "on" : ""} onClick={() => set2d(true)}>2D</button>
        <span className="sep" />
        <button onClick={() => (target.current.zoom = Math.min(2.6, target.current.zoom * 1.2))} aria-label="Zooma in">+</button>
        <button onClick={() => (target.current.zoom = Math.max(0.5, target.current.zoom / 1.2))} aria-label="Zooma ut">−</button>
        <span className="sep" />
        <button className={spin ? "on" : ""} onClick={() => setSpin((v) => !v)} title="Snurra">⟳</button>
        <button onClick={reset} title="Återställ vy">⌂</button>
      </div>
      {pop && (
        <div className="pop" style={{ left: pop.x, top: pop.y }}>
          <button className="x" onClick={() => onSelectItem(null)} aria-label="Stäng">×</button>
          <small>{pop.item.room}</small>
          <b>{pop.item.label.name}</b>
          {pop.item.label.size !== "–" && <span className="dim">{pop.item.label.size}</span>}
          <div className="row">
            <strong>{pop.item.label.price ? `ca ${pop.item.label.price.toLocaleString("sv-SE")} kr` : "Ingår"}</strong>
            <em>{pop.item.label.store}</em>
          </div>
        </div>
      )}
    </div>
  );
}
