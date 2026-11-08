import { geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import land110 from "world-atlas/land-110m.json";

export type LonLat = [number, number];

const toLand = (t: unknown) => {
  const topo = t as Topology<{ land: GeometryCollection }>;
  return feature(topo, topo.objects.land) as GeoPermissibleObjects;
};
const LAND_LO = toLand(land110);
let landHi: GeoPermissibleObjects | null = null;
let loading: Promise<void> | null = null;
const GRATICULE = geoGraticule10();

export const loadHiRes = () =>
  (loading ??= import("world-atlas/land-50m.json").then((m) => {
    landHi = toLand(m.default);
  }));

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function projection(center: LonLat, scale: number, cx: number, cy: number) {
  return geoOrthographic().rotate([-center[0], -center[1]]).scale(scale).translate([cx, cy]).clipAngle(90).precision(0.4);
}

export function paintBase(ctx: CanvasRenderingContext2D, proj: GeoProjection, w: number, h: number, base: number) {
  const path = geoPath(proj, ctx);
  const scale = proj.scale();
  const [cx, cy] = proj.translate();
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const sea = ctx.createRadialGradient(cx - scale * 0.3, cy - scale * 0.35, scale * 0.1, cx, cy, scale);
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
  return path;
}

export function paintRoute(ctx: CanvasRenderingContext2D, path: ReturnType<typeof geoPath>, route: (t: number) => LonLat, head: number, alpha = 1) {
  const steps = 80;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  path({ type: "LineString", coordinates: Array.from({ length: steps + 1 }, (_, i) => route(i / steps)) } as GeoPermissibleObjects);
  ctx.setLineDash([3, 5]);
  ctx.strokeStyle = "rgba(148,112,31,0.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);
  if (head > 0) {
    const n = Math.max(2, Math.ceil(steps * head));
    ctx.beginPath();
    path({ type: "LineString", coordinates: Array.from({ length: n + 1 }, (_, i) => route((i / n) * head)) } as GeoPermissibleObjects);
    ctx.strokeStyle = "#c8a45c";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function paintDot(ctx: CanvasRenderingContext2D, proj: GeoProjection, center: LonLat, p: LonLat, color: string, label: string, big: boolean, alpha = 1) {
  const xy = proj(p);
  if (!xy || geoDistance(p, center) > Math.PI / 2) return;
  ctx.globalAlpha = alpha;
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
  ctx.globalAlpha = 1;
}

export function paintPlane(ctx: CanvasRenderingContext2D, proj: GeoProjection, route: (t: number) => LonLat, head: number, size: number, color: string) {
  const a = proj(route(head));
  const b = proj(route(Math.min(1, head + 0.01)));
  if (!a || !b) return;
  ctx.save();
  ctx.translate(a[0], a[1]);
  ctx.rotate(Math.atan2(b[1] - a[1], b[0] - a[0]) || 0);
  ctx.scale(size / 24, size / 24);
  ctx.beginPath();
  const pts = [12, 0, 4, 2, -2, 11, -5, 11, -1, 2, -8, 2, -11, 5, -13, 5, -11, 0, -13, -5, -11, -5, -8, -2, -1, -2, -5, -11, -2, -11, 4, -2];
  ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.closePath();
  ctx.shadowColor = "rgba(20,33,58,0.35)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

export function fitCanvas(canvas: HTMLCanvasElement, wrap: HTMLElement) {
  const rect = wrap.getBoundingClientRect();
  canvas.width = Math.round(rect.width * devicePixelRatio);
  canvas.height = Math.round(rect.height * devicePixelRatio);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  return { w: rect.width, h: rect.height };
}
