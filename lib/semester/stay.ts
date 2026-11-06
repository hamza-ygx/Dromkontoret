import type { Box, Plan } from "../home/types";

const SAND = "#ecd9a8";
const SEA = "#2fa6c9";
const PALM = "#3f8f4a";
const PAVEMENT = "#d3cec5";

function sunbeds(x: number, y: number, count: number, parasol: string): Box[] {
  const out: Box[] = [];
  for (let i = 0; i < count; i++) {
    const bx = x + i * 2.4;
    out.push({ x: bx, y, z: 0, w: 0.7, d: 1.9, h: 0.32, color: "#f4f1ea" });
    out.push({ x: bx + 0.9, y, z: 0, w: 0.7, d: 1.9, h: 0.32, color: "#f4f1ea" });
    out.push({ x: bx + 0.76, y: y + 0.85, z: 0, w: 0.08, d: 0.08, h: 2.1, color: "#8a7a66" });
    out.push({ x: bx + 0.05, y: y + 0.15, z: 2.1, w: 1.6, d: 1.6, h: 0.08, round: true, color: parasol });
  }
  return out;
}

function palm(x: number, y: number, s: number): Box[] {
  return [
    { x: x - 0.1, y: y - 0.1, z: 0, w: 0.2, d: 0.2, h: 2.6 * s, color: "#8a6a45" },
    { x: x - 1.1 * s, y: y - 0.35 * s, z: 2.6 * s, w: 2.2 * s, d: 0.7 * s, h: 0.18, color: PALM, className: "crown" },
    { x: x - 0.35 * s, y: y - 1.1 * s, z: 2.62 * s, w: 0.7 * s, d: 2.2 * s, h: 0.18, color: PALM, className: "crown" },
    { x: x - 0.4 * s, y: y - 0.4 * s, z: 2.7 * s, w: 0.8 * s, d: 0.8 * s, h: 0.35, round: true, color: "#357a3f", className: "crown" },
  ];
}

export function toStay(plan: Plan, beach: boolean): Plan {
  const { x, y, w, d } = plan.bounds;
  const items = plan.items.map((i) => ({ ...i, label: { ...i.label, price: 0, store: "Möblerat" } }));
  const house = plan.config.type !== "lagenhet";
  const site = plan.site
    .filter((b) => !(b.className === "crown" || (b.color === "#7a5a3a" && b.w < 0.3)))
    .map((b) => (b.className === "lawn" ? { ...b, color: beach ? SAND : PAVEMENT } : b));

  if (beach) {
    const seaD = 6;
    const shore = y - 4.5;
    const left = x - 2.5, right = x + w + 2.5;
    if (!house) site.unshift({ x: left, y: shore, z: -0.36, w: right - left, d: y + d + 3 - shore, h: 0.02, flat: true, color: SAND, className: "lawn" });
    else site.unshift({ x: left, y: shore, z: -0.05, w: right - left, d: y - shore + 0.2, h: 0.02, flat: true, color: SAND, className: "lawn" });
    site.unshift({ x: left - 2, y: shore - seaD, z: -0.12, w: right - left + 4, d: seaD, h: 0.02, flat: true, color: SEA, className: "water lake" });
    site.unshift({ x: left - 2, y: shore - 0.6, z: -0.08, w: right - left + 4, d: 0.8, h: 0.02, flat: true, color: "#bfe6ef", className: "water lake" });
    site.push(...sunbeds(x + 0.6, shore + 1.2, Math.max(1, Math.floor((w - 1) / 2.6)), plan.config.vibe === "lyx" ? "#f4f1ea" : "#ff8a5c"));
    site.push(...palm(left + 1.4, shore + 2.2, 1.1), ...palm(right - 1.4, shore + 3.0, 1.25), ...palm(right - 1.2, y + d + 1.2, 0.95), ...palm(left + 1.2, y + d * 0.6, 1));
    return { ...plan, site, items, bounds: { x: left - 2, y: shore - seaD, w: right - left + 4, d: y + d + 3 - (shore - seaD) } };
  }

  const left = x - 4.4, right = x + w + 4.4;
  site.unshift({ x: left, y: y - 3, z: house ? -0.05 : -0.36, w: right - left, d: d + 6, h: 0.02, flat: true, color: PAVEMENT, className: "lawn" });
  for (const [gx, gw] of [[left, 3.6], [right - 3.6, 3.6]] as const) site.push({ x: gx, y: y - 1, z: 0, w: gw, d: d + 1, h: 3.4, color: "#e3ddd2", className: "ghost" });
  site.push(...palm(x + 1, y - 1.6, 0.8), ...palm(x + w - 1, y - 1.6, 0.8));
  return { ...plan, site, items, bounds: { x: left, y: y - 3, w: right - left, d: d + 6 } };
}
