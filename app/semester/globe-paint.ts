import { geoCircle, geoDistance, geoGraticule10, geoOrthographic, geoPath, type GeoPermissibleObjects, type GeoProjection } from "d3-geo";
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

const CITIES: LonLat[] = [
  [-74, 40.7], [-87.6, 41.9], [-118.2, 34], [-122.4, 37.8], [-95.4, 29.8], [-80.2, 25.8], [-79.4, 43.7], [-73.6, 45.5], [-99.1, 19.4], [-43.2, -22.9],
  [-46.6, -23.5], [-58.4, -34.6], [-70.7, -33.4], [-77, -12], [-74.1, 4.7], [-0.1, 51.5], [2.35, 48.86], [13.4, 52.5], [12.5, 41.9], [-3.7, 40.4],
  [18.07, 59.33], [10.75, 59.9], [12.57, 55.68], [24.9, 60.2], [37.6, 55.75], [30.5, 50.45], [21, 52.2], [16.4, 48.2], [28.98, 41.01], [31.24, 30.04],
  [3.4, 6.5], [36.8, -1.3], [28, -26.2], [18.4, -33.9], [46.7, 24.7], [55.3, 25.2], [51.4, 35.7], [67, 24.9], [72.9, 19.1], [77.2, 28.6],
  [88.4, 22.6], [80.3, 13.1], [90.4, 23.8], [100.5, 13.75], [106.8, -6.2], [103.8, 1.35], [101.7, 3.1], [114.2, 22.3], [121.5, 31.2], [116.4, 39.9],
  [126.98, 37.57], [139.7, 35.7], [135.5, 34.7], [151.2, -33.9], [144.96, -37.8], [174.8, -36.8], [120.98, 14.6], [113.3, 23.1], [104.1, 30.7], [-6.26, 53.35],
];

const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const CLOUDS = Array.from({ length: 20 }, (_, i) => ({ lon: rand(i) * 360 - 180, lat: (rand(i + 50) - 0.5) * 110, r: 3 + rand(i + 99) * 5 }));

export interface Sky {
  sun: LonLat;
}

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function projection(center: LonLat, scale: number, cx: number, cy: number) {
  return geoOrthographic().rotate([-center[0], -center[1]]).scale(scale).translate([cx, cy]).clipAngle(90).precision(0.4);
}

export function paintBase(ctx: CanvasRenderingContext2D, proj: GeoProjection, w: number, h: number, base: number, sky?: Sky) {
  const path = geoPath(proj, ctx);
  const scale = proj.scale();
  const [cx, cy] = proj.translate();
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  if (scale < Math.max(w, h)) {
    const glow = ctx.createRadialGradient(cx, cy, scale * 0.96, cx, cy, scale * 1.16);
    glow.addColorStop(0, "rgba(120,170,220,0.38)");
    glow.addColorStop(1, "rgba(120,170,220,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, scale * 1.16, 0, Math.PI * 2);
    ctx.fill();
  }
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
  if (sky) paintSky(ctx, path, proj, sky, scale / base);
  ctx.save();
  ctx.beginPath();
  path({ type: "Sphere" });
  ctx.clip();
  const limb = ctx.createRadialGradient(cx - scale * 0.25, cy - scale * 0.3, scale * 0.2, cx, cy, scale * 1.02);
  limb.addColorStop(0, "rgba(255,255,255,0.18)");
  limb.addColorStop(0.65, "rgba(255,255,255,0)");
  limb.addColorStop(1, "rgba(20,33,58,0.22)");
  ctx.fillStyle = limb;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
  return path;
}

function paintSky(ctx: CanvasRenderingContext2D, path: ReturnType<typeof geoPath>, proj: GeoProjection, sky: Sky, zoom: number) {
  const night: LonLat = [sky.sun[0] + 180, -sky.sun[1]];
  for (const [r, a] of [[96, 0.05], [90, 0.06], [84, 0.07]] as const) {
    ctx.beginPath();
    path(geoCircle().center(night).radius(r)());
    ctx.fillStyle = `rgba(20,33,58,${a})`;
    ctx.fill();
  }
  const rotate = proj.rotate();
  const center: LonLat = [-rotate[0], -rotate[1]];
  const r = Math.min(4, 1.3 * Math.sqrt(zoom));
  for (const c of CITIES) {
    if (geoDistance(c, night) > (80 * Math.PI) / 180 || geoDistance(c, center) > Math.PI / 2) continue;
    const xy = proj(c);
    if (!xy) continue;
    ctx.fillStyle = "rgba(255,206,120,0.28)";
    ctx.beginPath();
    ctx.arc(xy[0], xy[1], r * 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,226,160,0.95)";
    ctx.beginPath();
    ctx.arc(xy[0], xy[1], r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function paintClouds(ctx: CanvasRenderingContext2D, proj: GeoProjection, w: number, h: number, base: number, t: number) {
  const path = geoPath(proj, ctx);
  const zoom = proj.scale() / base;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = `rgba(255,255,255,${zoom > 2.2 ? 0.12 : 0.22})`;
  const drift = t * 0.8;
  for (const c of CLOUDS) {
    for (const [dx, dy, k] of [[0, 0, 1], [c.r * 0.9, c.r * 0.25, 0.65]] as const) {
      ctx.beginPath();
      path(geoCircle().center([c.lon + drift + dx, c.lat + dy]).radius(c.r * k).precision(10)());
      ctx.fill();
    }
  }
}

export function paintTrail(ctx: CanvasRenderingContext2D, path: ReturnType<typeof geoPath>, route: (t: number) => LonLat, head: number) {
  const step = 0.012;
  ctx.lineCap = "round";
  for (let i = 0; i < 10; i++) {
    const a = head - step * (i + 1), b = head - step * i;
    if (b <= 0) break;
    ctx.beginPath();
    path({ type: "LineString", coordinates: [route(Math.max(0, a)), route((a + b) / 2), route(b)] } as GeoPermissibleObjects);
    ctx.strokeStyle = `rgba(255,255,255,${0.75 * (1 - i / 10)})`;
    ctx.lineWidth = 6 - i * 0.4;
    ctx.stroke();
  }
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
