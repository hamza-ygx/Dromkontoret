import { placeById, preposition } from "../home/places";
import type { Box, Item, Opening, Room, WallRun } from "../home/types";
import { INDUSTRIES, staffFor } from "./catalog";
import { furnishOffice, siteItem } from "./furnish";
import { OFFICE_PALETTE } from "./palette";
import { car, charger } from "./parts";
import { MIN_W, program, type Spec } from "./programs";
import type { OfficeConfig, OfficePlan, OfficeRoomKind } from "./types";

const CORRIDOR = 1.6;
const r1 = (v: number) => Math.round(v * 10) / 10;
const DARK: OfficeRoomKind[] = ["wc", "forrad", "kyl", "disk"];
const SHOWCASE: OfficeRoomKind[] = ["matsal", "reception", "bar", "chambre"];
const WIDE: OfficeRoomKind[] = ["kontor", "matsal", "reception", "lounge", "storkok"];
const TILE: OfficeRoomKind[] = ["wc", "gym", "storkok", "disk", "kyl", "pentry"];
const ORDER: OfficeRoomKind[] = ["kontor", "storkok", "disk", "kyl", "pentry", "lounge", "personal", "gym", "matsal", "bar", "reception", "mote", "konferens", "chambre", "forrad", "wc"];

const width = (s: Spec, depth: number) => Math.max(s.min ?? MIN_W[s.kind], s.area / depth);
const sum = (l: Spec[], d: number) => l.reduce((a, s) => a + width(s, d), 0);

function balance(top: Spec[], bottom: Spec[], T: number, B: number) {
  for (let guard = 0; guard < 8; guard++) {
    const diff = sum(top, T) - sum(bottom, B);
    const [from, to, fd, td] = diff > 0 ? [top, bottom, T, B] : [bottom, top, B, T];
    let best = -1, bestGap = Math.abs(diff);
    from.forEach((s, i) => {
      if (!s.move) return;
      const gap = Math.abs(Math.abs(diff) - width(s, fd) - width(s, td));
      if (gap < bestGap - 0.3) [best, bestGap] = [i, gap];
    });
    if (best < 0) break;
    to.push(from.splice(best, 1)[0]);
  }
  const byOrder = (a: Spec, b: Spec) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind);
  top.sort(byOrder);
  bottom.sort(byOrder);
}

function windows(a: number, b: number, size: number, every = 3.2): Opening[] {
  const n = Math.max(1, Math.round((b - a) / every));
  const step = (b - a) / n;
  const w = Math.min(size, step - 0.8);
  if (w < 0.6) return [];
  return Array.from({ length: n }, (_, i) => {
    const m = a + step * (i + 0.5);
    return { a: m - w / 2, b: m + w / 2, kind: "window" as const };
  });
}

function doors(r: Room<OfficeRoomKind>): Opening[] {
  if (WIDE.includes(r.kind)) {
    const w = Math.min(1.6, r.w * 0.35);
    const xs = r.w > 9 ? [r.x + 0.4, r.x + r.w - 0.4 - w] : [r.x + 0.4];
    return xs.map((a) => ({ a, b: a + w, kind: "opening" as const }));
  }
  const w = r.kind === "wc" ? 0.8 : 0.9;
  const a = r.x + Math.min(0.35, (r.w - w) / 2);
  return [{ a, b: a + w, kind: "door" }];
}

export function generateOffice(cfg: OfficeConfig): OfficePlan {
  const pal = OFFICE_PALETTE[cfg.style];
  const staff = staffFor(cfg.size);
  const prog = program(cfg, staff);
  const { T, B } = prog;
  const top = [...prog.top], bottom = [...prog.bottom];
  balance(top, bottom, T, B);
  const D = T + CORRIDOR + B;
  const W = r1(Math.max(6, sum(top, T), sum(bottom, B), prog.target / D));

  const rooms: Room<OfficeRoomKind>[] = [];
  const row = (list: Spec[], depth: number, y: number, name: "top" | "bottom") => {
    const ws = list.map((s) => width(s, depth));
    const slack = W - ws.reduce((a, b) => a + b, 0);
    const growers = list.map((s, i) => (s.grow ? i : -1)).filter((i) => i >= 0);
    const share = growers.length ? growers : list.map((s, i) => (s.kind === "wc" || s.kind === "forrad" ? -1 : i)).filter((i) => i >= 0);
    share.forEach((i) => (ws[i] += slack / share.length));
    let x = 0;
    list.forEach((s, i) => {
      rooms.push({ id: `${name[0]}${i}`, kind: s.kind, name: s.name, row: name, x: r1(x), y, w: r1(ws[i]), d: depth });
      x += ws[i];
    });
    const last = rooms[rooms.length - 1];
    last.w = r1(W - last.x);
  };
  row(top, T, 0, "top");
  row(bottom, B, T + CORRIDOR, "bottom");
  rooms.push({ id: "hall", kind: "hall", name: prog.corridor, row: "corridor", x: 0, y: T, w: W, d: CORRIDOR });
  const topRooms = rooms.filter((r) => r.row === "top");
  const botRooms = rooms.filter((r) => r.row === "bottom");
  const specOf = (r: Room<OfficeRoomKind>) => [...top, ...bottom].find((s) => s.name === r.name)!;

  const walls: WallRun[] = [];
  const north = topRooms.flatMap((r) => (DARK.includes(r.kind) ? [] : windows(r.x, r.x + r.w, 1.8)));
  walls.push({ id: "n", axis: "h", at: 0, from: 0, to: W, exterior: true, side: "n", openings: north });
  const south = botRooms.flatMap((r): Opening[] => {
    if (DARK.includes(r.kind)) return [];
    const big = SHOWCASE.includes(r.kind) ? 2.4 : 1.6;
    if (!specOf(r).entry) return windows(r.x, r.x + r.w, big);
    const a = r.x + 0.6;
    return [{ a, b: a + 1.8, kind: "glassdoor" }, ...windows(a + 2.0, r.x + r.w, big)];
  });
  walls.push({ id: "s", axis: "h", at: D, from: 0, to: W, exterior: true, side: "s", openings: south });
  const side = (r: Room<OfficeRoomKind> | undefined, y0: number, y1: number) => (r && !DARK.includes(r.kind) ? windows(y0, y1, 1.4, 6) : []);
  walls.push({ id: "w", axis: "v", at: 0, from: 0, to: D, exterior: true, side: "w", openings: [{ a: T + 0.35, b: T + 1.25, kind: "door" }, ...side(topRooms[0], 0, T), ...side(botRooms[0], T + CORRIDOR, D)] });
  walls.push({ id: "e", axis: "v", at: W, from: 0, to: D, exterior: true, side: "e", openings: [...side(topRooms.at(-1), 0, T), ...side(botRooms.at(-1), T + CORRIDOR, D)] });
  walls.push({ id: "ih1", axis: "h", at: T, from: 0, to: W, exterior: false, side: "ih", openings: topRooms.flatMap(doors) });
  walls.push({ id: "ih2", axis: "h", at: T + CORRIDOR, from: 0, to: W, exterior: false, side: "ih", openings: botRooms.flatMap(doors) });
  const partitions = (list: Room<OfficeRoomKind>[], y0: number, y1: number, p: string) =>
    list.slice(1).forEach((r, i) => {
      const open = specOf(r).join ? [{ a: y0 + 0.3, b: y1 - 0.3, kind: "opening" as const }] : [];
      walls.push({ id: `${p}${i}`, axis: "v", at: r.x, from: y0, to: y1, exterior: false, side: "iv", openings: open });
    });
  partitions(topRooms, 0, T, "vt");
  partitions(botRooms, T + CORRIDOR, D, "vb");

  const site: Box[] = [];
  const extra: Item[] = [];
  const parking = cfg.addons.includes("parkering");
  const px = W + 1.4;
  const maxX = parking ? px + 5.8 : W + 1.6;
  site.push({ x: -1.6, y: -1.6, z: -0.06, w: maxX + 1.6, d: D + 4.4, h: 0.02, flat: true, color: "#d6d3cc", className: "floor" });
  site.push({ x: -1.6, y: D + 0.2, z: -0.04, w: maxX + 1.6, d: 2.6, h: 0.02, flat: true, color: "#e7e4dd", className: "floor" });
  site.push({ x: -0.15, y: -0.15, z: -0.25, w: W + 0.3, d: D + 0.3, h: 0.25, color: "#b9b4ab" });
  rooms.forEach((r) => {
    const color = TILE.includes(r.kind) ? pal.tile : r.kind === "forrad" || r.kind === "kyl" ? pal.concrete : cfg.style === "kreativt" && r.kind !== "hall" ? pal.concrete : pal.floor;
    site.push({ x: r.x, y: r.y, z: 0, w: r.w, d: r.d, h: 0.02, flat: true, color, className: "floor" });
  });
  const trees = Math.max(2, Math.floor(W / 8));
  for (let i = 0; i < trees; i++) {
    const tx = ((i + 0.5) * W) / trees, ty = D + 1.9, s = 1.5;
    site.push({ x: tx - 0.1, y: ty - 0.1, z: 0, w: 0.2, d: 0.2, h: 1.3, color: "#7a5a3a" });
    site.push({ x: tx - s / 2, y: ty - s / 2, z: 1.0, w: s, d: s, h: s * 0.8, round: true, color: pal.plant, className: "crown" });
  }
  if (parking) {
    const stalls = Math.max(3, Math.min(Math.floor((D + 1.2) / 2.5), Math.ceil(staff / 4) + 1));
    site.push({ x: px - 0.2, y: -0.4, z: -0.03, w: 5.6, d: stalls * 2.5 + 0.4, h: 0.02, flat: true, color: "#8e9196", className: "floor" });
    for (let i = 0; i <= stalls; i++) site.push({ x: px, y: -0.2 + i * 2.5, z: -0.01, w: 5, d: 0.08, h: 0.01, flat: true, color: "#f4f4f2", className: "floor" });
    [0, 1].forEach((i) => extra.push(siteItem(cfg, "charger", "Parkering", px + 5.0, i * 2.5 + 1.0, 0.3, 0.22, charger(pal))));
    [[0, pal.accent2], [2, "#c9ccd1"]].forEach(([i, c]) => {
      const k = i as number;
      car(c as string).forEach(([x, v, z, w, d, h, color]) => site.push({ x: px + 0.6 + v, y: k * 2.5 + 0.3 + x, z, w: d, d: w, h, color }));
    });
  }

  const { items, seats } = furnishOffice(cfg, rooms, pal, staff, prog.seats);
  const place = placeById(cfg.area);
  const company = cfg.industry === "restaurang" && seats <= 30 ? "Café" : INDUSTRIES.find((i) => i.id === cfg.industry)!.company;
  return {
    config: cfg,
    staff,
    width: W,
    depth: D,
    rooms,
    walls,
    site,
    items: [...items, ...extra],
    bounds: { x: -1.6, y: -1.6, w: maxX + 1.6, d: D + 4.4 },
    floorArea: Math.round(W * D),
    seats,
    title: `${company} ${preposition(place)} ${place.name}`,
  };
}
