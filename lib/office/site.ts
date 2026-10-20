import type { Box, Item, Rect, Room } from "../home/types";
import { siteItem } from "./furnish";
import type { OfficePalette } from "./palette";
import { car, charger } from "./parts";
import { timberRack, van } from "./parts-trade";
import type { OfficeConfig, OfficeRoomKind } from "./types";

const TILE: OfficeRoomKind[] = ["wc", "gym", "storkok", "disk", "kyl", "pentry"];
const CONCRETE: OfficeRoomKind[] = ["forrad", "kyl", "lager", "verkstad"];
const YARD = 7.5;

export function buildSite(cfg: OfficeConfig, pal: OfficePalette, rooms: Room<OfficeRoomKind>[], W: number, D: number, staff: number, vans: number) {
  const site: Box[] = [];
  const items: Item[] = [];
  const yard = vans > 0;
  const yw = yard ? Math.max(W, 7.4 + vans * 2.8) : W;
  const minY = yard ? -YARD - 1.6 : -1.6;
  const parking = cfg.addons.includes("parkering");
  const px = yw + 1.4;
  const maxX = parking ? px + 5.8 : yw + 1.6;

  site.push({ x: -1.6, y: minY, z: -0.06, w: maxX + 1.6, d: D + 2.8 - minY, h: 0.02, flat: true, color: "#d6d3cc", className: "floor" });
  site.push({ x: -1.6, y: D + 0.2, z: -0.04, w: maxX + 1.6, d: 2.6, h: 0.02, flat: true, color: "#e7e4dd", className: "floor" });
  site.push({ x: -0.15, y: -0.15, z: -0.25, w: W + 0.3, d: D + 0.3, h: 0.25, color: "#b9b4ab" });
  rooms.forEach((r) => {
    const color = TILE.includes(r.kind) ? pal.tile : CONCRETE.includes(r.kind) || (cfg.style === "kreativt" && r.kind !== "hall") ? pal.concrete : pal.floor;
    site.push({ x: r.x, y: r.y, z: 0, w: r.w, d: r.d, h: 0.02, flat: true, color, className: "floor" });
  });

  const trees = Math.max(2, Math.floor(W / 8));
  for (let i = 0; i < trees; i++) {
    const tx = ((i + 0.5) * W) / trees, ty = D + 1.9, s = 1.5;
    site.push({ x: tx - 0.1, y: ty - 0.1, z: 0, w: 0.2, d: 0.2, h: 1.3, color: "#7a5a3a" });
    site.push({ x: tx - s / 2, y: ty - s / 2, z: 1.0, w: s, d: s, h: s * 0.8, round: true, color: pal.plant, className: "crown" });
  }

  if (yard) {
    const y0 = -YARD - 0.4;
    site.push({ x: 0, y: y0, z: -0.03, w: yw, d: YARD, h: 0.02, flat: true, color: "#b8b2a6", className: "floor" });
    site.push({ x: 0, y: y0, z: 0, w: yw, d: 0.05, h: 1.8, color: "#9aa3ad", className: "ghost" });
    site.push({ x: 0, y: y0, z: 0, w: 0.05, d: YARD, h: 1.8, color: "#9aa3ad", className: "ghost" });
    site.push({ x: yw - 0.05, y: y0, z: 0, w: 0.05, d: YARD - 3.2, h: 1.8, color: "#9aa3ad", className: "ghost" });
    site.push({ x: 0.4, y: y0 + 3.6, z: 0, w: 6, d: 2.4, h: 2.4, color: "#3f6b4f" });
    items.push(siteItem(cfg, "timberRack", "Gård", 0.4, y0 + 0.3, 6, 1.2, timberRack(6)));
    for (let i = 0; i < vans; i++) items.push(siteItem(cfg, "van", "Gård", 7.4 + i * 2.8, y0 + 0.6, 2.0, 5.3, van(i % 2 ? "#f4f4f2" : pal.accent)));
  }

  if (parking) {
    const stalls = Math.max(3, Math.min(Math.floor((D + 1.2) / 2.5), Math.ceil(staff / 4) + 1));
    site.push({ x: px - 0.2, y: -0.4, z: -0.03, w: 5.6, d: stalls * 2.5 + 0.4, h: 0.02, flat: true, color: "#8e9196", className: "floor" });
    for (let i = 0; i <= stalls; i++) site.push({ x: px, y: -0.2 + i * 2.5, z: -0.01, w: 5, d: 0.08, h: 0.01, flat: true, color: "#f4f4f2", className: "floor" });
    [0, 1].forEach((i) => items.push(siteItem(cfg, "charger", "Parkering", px + 5.0, i * 2.5 + 1.0, 0.3, 0.22, charger(pal))));
    [[0, pal.accent2], [2, "#c9ccd1"]].forEach(([i, c]) => {
      const k = i as number;
      car(c as string).forEach(([x, v, z, w, d, h, color]) => site.push({ x: px + 0.6 + v, y: k * 2.5 + 0.3 + x, z, w: d, d: w, h, color }));
    });
  }

  const bounds: Rect = { x: -1.6, y: minY, w: maxX + 1.6, d: D + 2.8 - minY };
  return { site, items, bounds };
}
