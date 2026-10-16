import { PALETTE, SIZE, TYPES, VIBES } from "./catalog";
import { placeById, preposition } from "./places";
import { furnish, outdoorItem } from "./furnish";
import type { Box, Config, Item, Opening, Plan, Rect, Room, RoomKind, WallRun } from "./types";

const ROW: Record<Config["type"], { top: number; bottom: number }> = {
  lagenhet: { top: 4.2, bottom: 2.9 },
  radhus: { top: 4.4, bottom: 3.0 },
  villa: { top: 4.8, bottom: 3.2 },
  stuga: { top: 4.0, bottom: 2.8 },
};
const CORRIDOR = 1.4;

const MIN_W: Partial<Record<RoomKind, number>> = {
  vardagsrum: 3.6, sovrum: 2.7, barnrum: 2.5, kontor: 2.4, kok: 2.6, bad: 2.0, wc: 1.3, tvatt: 1.6, bastu: 1.7, klk: 1.3,
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const r1 = (v: number) => Math.round(v * 10) / 10;

interface Spec {
  kind: RoomKind;
  name: string;
  area: number;
  row: "top" | "bottom";
}

function bedroomNames(cfg: Config): [RoomKind, string][] {
  const others: Record<Config["vibe"], [RoomKind, string][]> = {
    ungdom: [["kontor", "Gamingrum"], ["sovrum", "Gästrum"], ["kontor", "Studio"], ["sovrum", "Sovrum"]],
    skandi: [["sovrum", "Sovrum 2"], ["kontor", "Arbetsrum"], ["sovrum", "Sovrum 3"], ["sovrum", "Gästrum"]],
    lyx: [["sovrum", "Gästsvit"], ["kontor", "Bibliotek"], ["sovrum", "Gästrum"], ["kontor", "Kontor"]],
    familj: [["barnrum", "Barnrum 1"], ["barnrum", "Barnrum 2"], ["barnrum", "Barnrum 3"], ["kontor", "Arbetsrum"]],
  };
  return [["sovrum", "Sovrum"], ...others[cfg.vibe]].slice(0, cfg.rooms - 1) as [RoomKind, string][];
}

function specs(cfg: Config, A: number): Spec[] {
  const out: Spec[] = [];
  const house = cfg.type !== "lagenhet";
  out.push({ kind: "vardagsrum", name: cfg.rooms === 1 ? "Rum" : "Vardagsrum", area: Math.max(cfg.rooms === 1 ? 20 : 18, A * (cfg.rooms === 1 ? 0.42 : 0.29)), row: "top" });
  bedroomNames(cfg).forEach(([kind, name], i) => {
    const area = i === 0 ? clamp(A * 0.16, 10, 18) : clamp(A * 0.115, 8, 13);
    out.push({ kind, name, area, row: i === 0 || (i === 1 && cfg.rooms >= 4) ? "top" : "bottom" });
  });
  out.push({ kind: "kok", name: "Kök", area: clamp(A * 0.13, 7, 22), row: "bottom" });
  out.push({ kind: "bad", name: "Badrum", area: clamp(A * 0.06, 4.2, 9), row: "bottom" });
  if (A >= 90) out.push({ kind: "wc", name: "WC", area: 2.6, row: "bottom" });
  if (house && A >= 70) out.push({ kind: "tvatt", name: "Tvätt", area: 4.2, row: "bottom" });
  if (cfg.extras.includes("bastu") && cfg.type !== "stuga") out.push({ kind: "bastu", name: "Bastu", area: 4, row: "bottom" });
  if (A >= 60) out.push({ kind: "klk", name: "Klk", area: 2.8, row: "bottom" });
  return out;
}

function widths(list: Spec[], depth: number) {
  return list.map((s) => Math.max(MIN_W[s.kind] ?? 1.5, s.area / depth));
}

/** Order bottom row: kitchen first (under the living room), wet rooms together, then bedrooms. */
const BOTTOM_ORDER: RoomKind[] = ["kok", "bad", "wc", "bastu", "tvatt", "klk", "sovrum", "barnrum", "kontor"];

function rowsFor(cfg: Config, A: number) {
  const { top: T, bottom: B } = ROW[cfg.type];
  const all = specs(cfg, A);
  let top = all.filter((s) => s.row === "top");
  let bottom = all.filter((s) => s.row === "bottom");
  const sum = (l: Spec[], d: number) => widths(l, d).reduce((a, b) => a + b, 0);
  const isBed = (s: Spec) => ["sovrum", "barnrum", "kontor"].includes(s.kind);
  for (let guard = 0; guard < 6; guard++) {
    const st = sum(top, T), sb = sum(bottom, B);
    if (sb > st + 2.5) {
      const i = bottom.findIndex(isBed);
      if (i < 0) break;
      top = [...top, bottom[i]];
      bottom = bottom.filter((_, j) => j !== i);
    } else if (st > sb + 5 && top.filter(isBed).length > 1) {
      const s = top[top.length - 1];
      top = top.slice(0, -1);
      bottom = [...bottom, s];
    } else break;
  }
  bottom.sort((a, b) => BOTTOM_ORDER.indexOf(a.kind) - BOTTOM_ORDER.indexOf(b.kind));
  return { top, bottom, T, B };
}

function windowIn(a: number, b: number, max: number): Opening | null {
  const w = Math.min(max, b - a - 0.8);
  if (w < 0.6) return null;
  const m = (a + b) / 2;
  return { a: m - w / 2, b: m + w / 2, kind: "window" };
}

const WET: RoomKind[] = ["bad", "wc", "klk", "bastu", "tvatt"];

export function generate(cfg: Config): Plan {
  const pal = PALETTE[cfg.vibe];
  const A = SIZE[cfg.type][cfg.rooms - 1];
  const { top, bottom, T, B } = rowsFor(cfg, A);
  const wTop = widths(top, T);
  const wBot = widths(bottom, B);
  const W = r1(Math.max(6, wTop.reduce((a, b) => a + b, 0), wBot.reduce((a, b) => a + b, 0)));
  // Give the slack to the living room (top) and kitchen + last room (bottom).
  const slackTop = W - wTop.reduce((a, b) => a + b, 0);
  wTop[0] += slackTop;
  const slackBot = W - wBot.reduce((a, b) => a + b, 0);
  if (slackBot > 2.5 && wBot.length > 1) {
    wBot[0] += slackBot / 2;
    wBot[wBot.length - 1] += slackBot / 2;
  } else wBot[0] += slackBot;

  const D = T + CORRIDOR + B;
  const rooms: Room[] = [];
  let x = 0;
  top.forEach((s, i) => {
    rooms.push({ id: `t${i}`, kind: s.kind, name: s.name, row: "top", x: r1(x), y: 0, w: r1(wTop[i]), d: T });
    x += wTop[i];
  });
  x = 0;
  bottom.forEach((s, i) => {
    rooms.push({ id: `b${i}`, kind: s.kind, name: s.name, row: "bottom", x: r1(x), y: T + CORRIDOR, w: r1(wBot[i]), d: B });
    x += wBot[i];
  });
  // Snap the last room in each row to the exact width.
  for (const row of ["top", "bottom"] as const) {
    const rs = rooms.filter((r) => r.row === row);
    const last = rs[rs.length - 1];
    last.w = r1(W - last.x);
  }
  rooms.push({ id: "hall", kind: "hall", name: cfg.type === "lagenhet" ? "Hall" : "Hall", row: "corridor", x: 0, y: T, w: W, d: CORRIDOR });

  const hasDeck = cfg.extras.includes("balkong");
  const living = rooms[0];

  // ---------- walls ----------
  const walls: WallRun[] = [];
  const topRooms = rooms.filter((r) => r.row === "top");
  const botRooms = rooms.filter((r) => r.row === "bottom");

  const north: Opening[] = [];
  topRooms.forEach((r) => {
    if (r === living && hasDeck) {
      const gw = Math.min(2.4, r.w - 1.2);
      north.push({ a: r.x + 0.5, b: r.x + 0.5 + gw, kind: "glassdoor" });
      const win = windowIn(r.x + 0.5 + gw, r.x + r.w, 1.6);
      if (win) north.push(win);
    } else if (r.w > 5.4) {
      const half = r.x + r.w / 2;
      [windowIn(r.x, half, 1.6), windowIn(half, r.x + r.w, 1.6)].forEach((o) => o && north.push(o));
    } else {
      const win = windowIn(r.x, r.x + r.w, 1.8);
      if (win) north.push(win);
    }
  });
  walls.push({ id: "n", axis: "h", at: 0, from: 0, to: W, exterior: true, side: "n", openings: north });

  const south: Opening[] = [];
  botRooms.forEach((r) => {
    if (WET.includes(r.kind)) return;
    const win = windowIn(r.x, r.x + r.w, 1.5);
    if (win) south.push(win);
  });
  walls.push({ id: "s", axis: "h", at: D, from: 0, to: W, exterior: true, side: "s", openings: south });

  const west: Opening[] = [{ a: T + 0.25, b: T + 1.15, kind: "door" }];
  const tl = topRooms[0];
  const wt = windowIn(0, T, 1.4);
  if (tl && wt) west.push(wt);
  const bl = botRooms[0];
  if (bl && !WET.includes(bl.kind)) {
    const wb = windowIn(T + CORRIDOR, D, 1.2);
    if (wb) west.push(wb);
  }
  walls.push({ id: "w", axis: "v", at: 0, from: 0, to: D, exterior: true, side: "w", openings: west });

  const east: Opening[] = [];
  const tr = topRooms[topRooms.length - 1];
  if (tr && tr !== tl) {
    const w = windowIn(0, T, 1.4);
    if (w) east.push(w);
  }
  const br = botRooms[botRooms.length - 1];
  if (br && !WET.includes(br.kind) && br !== bl) {
    const w = windowIn(T + CORRIDOR, D, 1.2);
    if (w) east.push(w);
  }
  walls.push({ id: "e", axis: "v", at: W, from: 0, to: D, exterior: true, side: "e", openings: east });

  const doorFor = (r: Room): Opening => {
    if (r.kind === "vardagsrum") {
      // Left side is circulation; the lounge sits to the right.
      const w = Math.min(1.5, r.w * 0.35);
      return { a: r.x + 0.35, b: r.x + 0.35 + w, kind: "opening" };
    }
    if (r.kind === "kok") {
      const w = Math.min(1.4, r.w - 0.9);
      return { a: r.x + 0.45, b: r.x + 0.45 + w, kind: "opening" };
    }
    const w = r.kind === "wc" || r.kind === "klk" ? 0.75 : 0.85;
    const a = r.x + Math.min(0.35, (r.w - w) / 2);
    return { a, b: a + w, kind: "door" };
  };
  walls.push({ id: "ih1", axis: "h", at: T, from: 0, to: W, exterior: false, side: "ih", openings: topRooms.map(doorFor) });
  walls.push({ id: "ih2", axis: "h", at: T + CORRIDOR, from: 0, to: W, exterior: false, side: "ih", openings: botRooms.map(doorFor) });
  topRooms.slice(1).forEach((r, i) => walls.push({ id: `vt${i}`, axis: "v", at: r.x, from: 0, to: T, exterior: false, side: "iv", openings: [] }));
  botRooms.slice(1).forEach((r, i) => walls.push({ id: `vb${i}`, axis: "v", at: r.x, from: T + CORRIDOR, to: D, exterior: false, side: "iv", openings: [] }));

  // ---------- site ----------
  const site: Box[] = [];
  const outdoor: Item[] = [];
  const add = (b: Box) => site.push(b);
  const house = cfg.type !== "lagenhet";
  const pool = cfg.extras.includes("pool");
  const garden = cfg.extras.includes("tradgard") && house;
  const sauna = cfg.extras.includes("bastu");
  let minY = -0.6, maxY = D + 0.6, minX = -0.6, maxX = W + 0.6;

  // Floors
  rooms.forEach((r) => {
    const wet = WET.includes(r.kind) && r.kind !== "klk";
    add({ x: r.x, y: r.y, z: 0, w: r.w, d: r.d, h: 0.02, flat: true, color: wet ? pal.tile : r.kind === "hall" ? pal.floor : pal.floor, className: `floor ${wet ? "tile" : "wood"}` });
  });

  if (!house) {
    // Apartment: floating on its concrete slab, balcony out front.
    add({ x: -0.3, y: -0.3, z: -0.32, w: W + 0.6, d: D + 0.6, h: 0.3, color: "#cfd3d8" });
    if (hasDeck || pool) {
      const bw = pool ? Math.min(W - 0.4, Math.max(5.5, living.w + 1.5)) : Math.min(3.4, living.w - 0.4);
      const bd = pool ? 3.6 : 1.6;
      const bx = Math.max(0.2, living.x + 0.2);
      add({ x: bx, y: -bd, z: -0.18, w: bw, d: bd, h: 0.16, color: "#d9dde2" });
      add({ x: bx, y: -bd, z: 0, w: bw, d: bd, h: 0.02, flat: true, color: pal.wood, className: "floor deck" });
      add({ x: bx, y: -bd, z: 0, w: bw, d: 0.04, h: 1.05, glass: true, color: "#bcd7e6" });
      add({ x: bx, y: -bd, z: 0, w: 0.04, d: bd, h: 1.05, glass: true, color: "#bcd7e6" });
      add({ x: bx + bw - 0.04, y: -bd, z: 0, w: 0.04, d: bd, h: 1.05, glass: true, color: "#bcd7e6" });
      if (pool) {
        add({ x: bx + bw - 2.3, y: -bd + 0.35, z: 0, w: 1.9, d: 1.9, h: 0.75, round: true, color: "#e8e4dc" });
        add({ x: bx + bw - 2.15, y: -bd + 0.5, z: 0.76, w: 1.6, d: 1.6, h: 0.01, round: true, flat: true, color: "#5ec5e0", className: "water" });
      }
      minY = -bd - 0.4;
    }
  } else {
    // Houses: plinth, lawn, deck, pool, garden.
    const deckD = hasDeck ? 2.8 : 0;
    const poolZone = pool && cfg.type !== "stuga" ? (cfg.type === "villa" ? 5.6 : 4.6) : 0;
    const gardenTop = -(deckD + poolZone + (garden ? 4 : 2.2));
    const lakeD = cfg.type === "stuga" ? 7 : 0;
    const side = garden ? 5 : 2.5;
    const left = cfg.type === "radhus" ? 0 : -2.5;
    const right = W + (cfg.type === "radhus" ? 0 : side);
    add({ x: -0.15, y: -0.15, z: -0.25, w: W + 0.3, d: D + 0.3, h: 0.25, color: "#b9b4ab" });
    add({ x: left, y: gardenTop, z: -0.04, w: right - left, d: D + 2.5 - gardenTop, h: 0.03, flat: true, color: "#8fbf6a", className: "lawn" });
    // Entrance path on the west side
    if (cfg.type !== "radhus") add({ x: -2.5, y: T + 0.2, z: -0.02, w: 2.5, d: 1.0, h: 0.02, flat: true, color: "#cfc6b6" });
    if (hasDeck) {
      const dw = Math.min(W, Math.max(5, living.w + 2));
      add({ x: 0, y: -deckD, z: -0.05, w: dw, d: deckD, h: 0.12, color: pal.wood, className: "deck" });
      outdoor.push(outdoorItem(cfg, "outdoorSofa", dw - 2.5, -deckD + 0.35, pal));
    }
    if (pool && cfg.type !== "stuga") {
      const pw = cfg.type === "villa" ? 7 : 5;
      const pd = cfg.type === "villa" ? 3.2 : 2.6;
      const px = Math.max(0.5, Math.min(W - pw - 0.5, living.x + living.w / 2 - pw / 2 + 1));
      const py = -deckD - 0.8 - pd;
      add({ x: px - 0.35, y: py - 0.35, z: -0.03, w: pw + 0.7, d: pd + 0.7, h: 0.08, color: "#e6e1d8" });
      add({ x: px, y: py, z: 0.03, w: pw, d: pd, h: 0.02, flat: true, color: "#3fb3d6", className: "water pool" });
      outdoor.push(outdoorItem(cfg, "loungers", px - 2.4 >= left + 0.3 ? px - 2.4 : px + pw + 0.6, py + 0.2, pal));
    }
    if (pool && cfg.type === "stuga") {
      const tx = hasDeck ? Math.min(W - 2.2, living.x + living.w - 1.6) : W + 0.6;
      const ty = hasDeck ? -deckD + 0.4 : 0.6;
      add({ x: tx, y: ty, z: 0.05, w: 1.7, d: 1.7, h: 0.9, round: true, color: "#8a5a3c" });
      add({ x: tx + 0.12, y: ty + 0.12, z: 0.96, w: 1.46, d: 1.46, h: 0.01, round: true, flat: true, color: "#6fc7dc", className: "water" });
    }
    // Trees
    const trees: [number, number, number][] = [
      [left + 1.2, gardenTop + 1.2, 2.2],
      [right - 1.4, gardenTop + 1.6, 2.6],
      [right - 1.0, D + 1.2, 1.6],
    ];
    if (garden) trees.push([left + 1.0, D * 0.55, 1.8], [right - 1.2, D * 0.4, 2.0], [(left + right) / 2, gardenTop + 1.0, 1.4]);
    trees.forEach(([tx, ty, s]) => {
      add({ x: tx - 0.12, y: ty - 0.12, z: 0, w: 0.24, d: 0.24, h: 1.4 * s * 0.6, color: "#7a5a3a" });
      add({ x: tx - s / 2, y: ty - s / 2, z: s * 0.55, w: s, d: s, h: s * 0.75, round: true, color: pal.plant, className: "crown" });
      add({ x: tx - s * 0.32, y: ty - s * 0.32, z: s * 1.3, w: s * 0.64, d: s * 0.64, h: s * 0.45, round: true, color: shadeHex(pal.plant, 1.12), className: "crown" });
    });
    if (garden) {
      outdoor.push(outdoorItem(cfg, "trampoline", left + 0.8, gardenTop + 1.4 + (cfg.vibe === "familj" ? 0.6 : 0), pal));
      // Hedge along the garden edge, carport with a car on the east side.
      add({ x: left + 0.2, y: gardenTop + 0.1, z: 0, w: right - left - 0.4, d: 0.5, h: 1.1, color: "#5c8d4a" });
      if (cfg.type !== "radhus") {
        const cx = W + 0.8;
        add({ x: cx, y: T - 0.4, z: 0, w: 3.4, d: 5.6, h: 0.02, flat: true, color: "#b8b2a6" });
        [[cx, T - 0.4], [cx + 3.2, T - 0.4], [cx, T + 5.0], [cx + 3.2, T + 5.0]].forEach(([px, py]) =>
          add({ x: px, y: py, z: 0, w: 0.15, d: 0.15, h: 2.4, color: "#55595f" }),
        );
        add({ x: cx - 0.1, y: T - 0.5, z: 2.4, w: 3.6, d: 5.8, h: 0.12, color: "#3d4248" });
        add({ x: cx + 0.75, y: T + 0.4, z: 0.25, w: 1.85, d: 4.3, h: 0.7, color: VIBES.find((v) => v.id === cfg.vibe)!.swatch[cfg.vibe === "skandi" ? 2 : 1] });
        add({ x: cx + 0.9, y: T + 1.4, z: 0.95, w: 1.55, d: 2.1, h: 0.5, color: "#2b3138" });
        maxX = Math.max(maxX, cx + 3.8);
      }
    }
    if (cfg.type === "radhus") {
      // Neighbours on both sides.
      for (const nx of [-7, W]) {
        add({ x: nx + 0.1, y: 0, z: 0, w: 6.8, d: D, h: 5.4, color: "#e7e2da", className: "ghost" });
        add({ x: nx < 0 ? left : right - 0.08, y: gardenTop + 0.3, z: 0, w: 0.08, d: -gardenTop - 0.3, h: 1.2, color: "#a88b6a" });
      }
      minX = -7;
      maxX = W + 7;
    }
    if (cfg.type === "stuga") {
      const lakeY = gardenTop - lakeD;
      add({ x: left - 3, y: lakeY, z: -0.12, w: right - left + 6, d: lakeD, h: 0.02, flat: true, color: "#2f8fbf", className: "water lake" });
      const jx = (left + right) / 2 - 0.7;
      add({ x: jx, y: lakeY + 1.2, z: 0.02, w: 1.4, d: lakeD - 1.2 + 0.6, h: 0.1, color: pal.wood, className: "deck" });
      if (sauna) {
        const sx = right - 3.6;
        const sy = gardenTop + 0.4;
        add({ x: sx, y: sy, z: 0, w: 2.6, d: 2.2, h: 2.2, color: "#a3322a" });
        add({ x: sx - 0.15, y: sy - 0.15, z: 2.2, w: 2.9, d: 2.5, h: 0.14, color: "#2f2f2f" });
        add({ x: sx + 2.0, y: sy + 0.4, z: 2.34, w: 0.22, d: 0.22, h: 0.7, color: "#3a3a3a", className: "chimney" });
      }
      minY = lakeY;
      minX = Math.min(minX, left - 3);
      maxX = Math.max(maxX, right + 3);
    }
    minY = Math.min(minY, gardenTop);
    maxY = Math.max(maxY, D + 2.5);
    minX = Math.min(minX, left);
    maxX = Math.max(maxX, right);
  }

  const { items: inside, decor } = furnish(cfg, rooms, pal);
  site.push(...decor);
  const items = [...inside, ...outdoor];
  const livingArea = Math.round(rooms.reduce((a, r) => a + r.w * r.d, 0));
  const typeLabel = TYPES.find((t) => t.id === cfg.type)!.label;
  const place = placeById(cfg.area);
  const roomWord = ["Etta", "Tvåa", "Trea", "Fyra", "Femma"][cfg.rooms - 1];
  const title = `${cfg.type === "lagenhet" ? roomWord : typeLabel} ${preposition(place)} ${place.name}`;
  const bounds: Rect = { x: minX, y: minY, w: maxX - minX, d: maxY - minY };
  return { config: cfg, width: W, depth: D, rooms, walls, site, items, bounds, livingArea, title };
}

export function shadeHex(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return "#" + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, "0")).join("");
}
