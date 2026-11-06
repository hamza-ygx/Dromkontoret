"use client";

import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";

type LonLat = [number, number];

const toLand = (t: unknown) => {
  const topo = t as Topology<{ land: GeometryCollection }>;
  return feature(topo, topo.objects.land) as GeoPermissibleObjects;
};
const LAND_LO = toLand(land110);
let landHi: GeoPermissibleObjects | null = null;
const GRATICULE = geoGraticule10();

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function plane(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(size / 24, size / 24);
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(4, 2);
  ctx.lineTo(-2, 11);
  ctx.lineTo(-5, 11);
  ctx.lineTo(-1, 2);
  ctx.lineTo(-8, 2);
  ctx.lineTo(-11, 5);
  ctx.lineTo(-13, 5);
  ctx.lineTo(-11, 0);
  ctx.lineTo(-13, -5);
  ctx.lineTo(-11, -5);
  ctx.lineTo(-8, -2);
  ctx.lineTo(-1, -2);
  ctx.lineTo(-5, -11);
  ctx.lineTo(-2, -11);
  ctx.lineTo(4, -2);
  ctx.closePath();
  ctx.shadowColor = "rgba(20,33,58,0.35)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

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
  const progress = useRef({ fly: 0, zoom: 0 });
  const redraw = useRef<() => void>(() => {});

  useEffect(() => {
    if (!landHi)
      import("world-atlas/land-50m.json").then((m) => {
        landHi = toLand(m.default);
        redraw.current();
      });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const route = geoInterpolate(from, to);
    const dist = geoDistance(from, to) * 6371;
    const lift = clamp(dist / 12000, 0.12, 0.55);
    let w = 0, h = 0;

    const draw = () => {
      if (!w || !h) return;
      const { fly, zoom } = progress.current;
      const base = Math.min(w, h) * 0.42;
      const s0 = base * 1.45;
      const s1 = Math.max(s0, w / 0.27);
      const z = ease(zoom);
      const scale = zoom > 0 ? s0 * Math.pow(s1 / s0, z) : s0 * (1 - lift * Math.sin(Math.PI * ease(fly)));
      const center = route(Math.min(1, ease(fly) * 1.02));
      const proj = geoOrthographic().rotate([-center[0], -center[1]]).scale(scale).translate([w / 2, h * (w < 600 ? 0.36 : 0.5)]).clipAngle(90).precision(0.4);
      const path = geoPath(proj, ctx);
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = scale;
      const cy = h * (w < 600 ? 0.36 : 0.5);
      const sea = ctx.createRadialGradient(w / 2 - r * 0.3, cy - r * 0.35, r * 0.1, w / 2, cy, r);
      sea.addColorStop(0, "#eef4f8");
      sea.addColorStop(1, "#c9d9e6");
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = sea;
      ctx.fill();
      ctx.strokeStyle = "rgba(20,33,58,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      path(GRATICULE);
      ctx.strokeStyle = "rgba(20,33,58,0.06)";
      ctx.stroke();

      ctx.beginPath();
      path(scale > base * 2.2 && landHi ? landHi : LAND_LO);
      ctx.fillStyle = "#f7f2e7";
      ctx.fill();
      ctx.strokeStyle = "#cdbf9f";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const steps = 80;
      const full = { type: "LineString", coordinates: Array.from({ length: steps + 1 }, (_, i) => route(i / steps)) } as GeoPermissibleObjects;
      ctx.beginPath();
      path(full);
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = "rgba(148,112,31,0.45)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      const head = Math.min(1, ease(fly));
      if (head > 0) {
        const n = Math.max(2, Math.ceil(steps * head));
        ctx.beginPath();
        path({ type: "LineString", coordinates: Array.from({ length: n + 1 }, (_, i) => route((i / n) * head)) } as GeoPermissibleObjects);
        ctx.strokeStyle = "#c8a45c";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      const dot = (p: LonLat, color: string, label: string, big: boolean) => {
        const xy = proj(p);
        if (!xy || geoDistance(p, center) > Math.PI / 2) return;
        ctx.beginPath();
        ctx.arc(xy[0], xy[1], big ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
        ctx.font = `600 ${big ? 14 : 12}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#14213a";
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 4;
        ctx.strokeText(label, xy[0] + 11, xy[1] + 4);
        ctx.fillText(label, xy[0] + 11, xy[1] + 4);
      };
      if (zoom < 0.6) dot(from, "#14213a", fromLabel, false);
      if (fly > 0.6 && zoom < 0.7) dot(to, "#c8a45c", toLabel, true);

      if (fly > 0 && zoom < 0.5) {
        const p = route(head);
        const ahead = route(Math.min(1, head + 0.01));
        const a = proj(p), b = proj(ahead);
        if (a && b) plane(ctx, a[0], a[1], Math.atan2(b[1] - a[1], b[0] - a[0]) || 0, jet ? 30 : 26, jet ? "#14213a" : "#c8a45c");
      }
    };
    redraw.current = draw;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * devicePixelRatio);
      canvas.height = Math.round(h * devicePixelRatio);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flyMs = reduce ? 1 : 1700 + 1500 * clamp(dist / 9000, 0, 1);
    const zoomMs = reduce ? 1 : 1300;
    const start = performance.now() + (reduce ? 0 : 450);
    let raf = 0, done = false;
    progress.current = { fly: 0, zoom: 0 };
    const tick = (now: number) => {
      const t = now - start;
      progress.current = { fly: clamp(t / flyMs, 0, 1), zoom: clamp((t - flyMs - 150) / zoomMs, 0, 1) };
      draw();
      if (progress.current.zoom < 1) raf = requestAnimationFrame(tick);
      else if (!done) {
        done = true;
        arriveRef.current();
      }
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
