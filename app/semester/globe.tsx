"use client";

import { geoDistance, geoInterpolate } from "d3-geo";
import { useEffect, useRef } from "react";
import { clamp, ease, fitCanvas, loadHiRes, paintBase, paintDot, paintPlane, paintRoute, projection, type LonLat } from "./globe-paint";

export function Globe({
  from,
  to,
  fromLabel,
  toLabel,
  jet,
  buildId,
  onArrive,
}: {
  from: LonLat;
  to: LonLat;
  fromLabel: string;
  toLabel: string;
  jet: boolean;
  buildId: number;
  onArrive: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arriveRef = useRef(onArrive);
  arriveRef.current = onArrive;
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    loadHiRes().then(() => redraw.current());
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const route = geoInterpolate(from, to);
    const dist = geoDistance(from, to) * 6371;
    const lift = clamp(dist / 12000, 0.12, 0.55);
    let w = 0, h = 0, fly = 0, zoom = 0;

    const draw = () => {
      if (!w || !h) return;
      const base = Math.min(w, h) * 0.42;
      const s0 = base * 1.45;
      const s1 = Math.max(s0, w / 0.27);
      const scale = zoom > 0 ? s0 * Math.pow(s1 / s0, ease(zoom)) : s0 * (1 - lift * Math.sin(Math.PI * ease(fly)));
      const center = route(Math.min(1, ease(fly) * 1.02));
      const proj = projection(center, scale, w / 2, h * (w < 600 ? 0.36 : 0.5));
      const path = paintBase(ctx, proj, w, h, base);
      const head = Math.min(1, ease(fly));
      paintRoute(ctx, path, route, head);
      if (zoom < 0.6) paintDot(ctx, proj, center, from, "#14213a", fromLabel, false);
      if (fly > 0.6 && zoom < 0.7) paintDot(ctx, proj, center, to, "#c8a45c", toLabel, true);
      if (fly > 0 && zoom < 0.5) paintPlane(ctx, proj, route, head, jet ? 30 : 26, jet ? "#14213a" : "#c8a45c");
    };
    redraw.current = draw;

    const ro = new ResizeObserver(() => {
      ({ w, h } = fitCanvas(canvas, wrap));
      draw();
    });
    ro.observe(wrap);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flyMs = reduce ? 1 : 1700 + 1500 * clamp(dist / 9000, 0, 1);
    const zoomMs = reduce ? 1 : 1300;
    const start = performance.now() + (reduce ? 0 : 450);
    let raf = 0;
    const tick = (now: number) => {
      const t = now - start;
      fly = clamp(t / flyMs, 0, 1);
      zoom = clamp((t - flyMs - 150) / zoomMs, 0, 1);
      draw();
      if (zoom < 1) raf = requestAnimationFrame(tick);
      else arriveRef.current();
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [from[0], from[1], to[0], to[1], fromLabel, toLabel, jet, buildId]);

  return (
    <div className="globe" ref={wrapRef}>
      <canvas ref={canvasRef} aria-label={`Flygresa från ${fromLabel} till ${toLabel}`} role="img" />
    </div>
  );
}
