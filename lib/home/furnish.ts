import { CATALOG, type CatalogKind, type Palette } from "./catalog";
import type { Box, Config, Item, Room } from "./types";

/** A part of a piece of furniture in item-local metres: lx along the room width, lv away from the item's back. */
export type Part = [lx: number, lv: number, z: number, w: number, d: number, h: number, color: string, opts?: Partial<Box>];

export const WHITE = "#f4f4f2";
export const BLACK = "#22252a";
export const PORCELAIN = "#fbfbfa";

let seq = 0;

/** Place parts in a room. `front` mirrors the item so its back sits against the corridor-side wall. */
export function place(room: Room<string>, u: number, v: number, w: number, d: number, parts: Part[], front = false): { boxes: Box[]; rect: { x: number; y: number; w: number; d: number } } {
  // Local frame: top-row rooms have their window wall at y = room.y; bottom-row rooms at y = room.y + room.d.
  const flipRoom = room.row === "bottom";
  const boxes = parts.map(([lx, lv, z, bw, bd, h, color, opts]) => {
    const vv = front ? room.d - v - lv - bd : v + lv; // distance from the window wall
    const y = flipRoom ? room.y + room.d - vv - bd : room.y + vv;
    return { x: room.x + u + lx, y, z, w: bw, d: bd, h, color, ...opts } as Box;
  });
  const v0 = front ? room.d - v - d : v;
  const y0 = flipRoom ? room.y + room.d - v0 - d : room.y + v0;
  return { boxes, rect: { x: room.x + u, y: y0, w, d } };
}

function item(cfg: Config, kind: CatalogKind | null, room: Room, placed: ReturnType<typeof place>): Item {
  const label = kind ? CATALOG[kind][cfg.vibe] : { name: "", size: "", price: 0, store: "" };
  return { id: `i${seq++}`, room: room.name, label, boxes: placed.boxes, ...placed.rect };
}

// ---------- furniture builders (item-local parts) ----------

const sofa = (p: Palette, w: number, vibe: Config["vibe"]): Part[] => {
  const d = 0.92;
  const parts: Part[] = [
    [0, 0, 0, w, d, 0.42, p.textile],
    [0, 0, 0.42, w, 0.24, 0.42, p.textile, { className: "dk" }],
    [0, 0, 0.42, 0.2, d, 0.2, p.textile],
    [w - 0.2, 0, 0.42, 0.2, d, 0.2, p.textile],
    [0.25, 0.3, 0.42, 0.42, 0.18, 0.32, p.accent2],
    [w - 0.67, 0.3, 0.42, 0.42, 0.18, 0.32, p.accent],
  ];
  if (vibe === "familj") parts.push([w - 0.95, d, 0, 0.95, 0.8, 0.42, p.textile]);
  return parts;
};
const coffee = (p: Palette, vibe: Config["vibe"]): Part[] =>
  vibe === "lyx" ? [[0, 0, 0, 1.2, 0.65, 0.36, "#e9e5df"]] : [[0, 0, 0, 1.0, 0.56, 0.42, p.wood]];
const tvBench = (p: Palette, w: number): Part[] => [
  [0, 0, 0, w, 0.42, 0.46, p.dark],
  [w * 0.12, 0.16, 0.46, w * 0.76, 0.05, w * 0.42, BLACK, { className: "screen" }],
];
export const rug = (p: Palette, w: number, d: number): Part[] => [[0, 0, 0.02, w, d, 0.01, p.rug, { flat: true }]];
export const plant = (p: Palette, s = 1): Part[] => [
  [0.05 * s, 0.05 * s, 0, 0.4 * s, 0.4 * s, 0.42 * s, "#c46f4a", { round: true }],
  [-0.12 * s, -0.12 * s, 0.42 * s, 0.74 * s, 0.74 * s, 0.75 * s, p.plant, { round: true, className: "crown" }],
];
export const lamp = (p: Palette): Part[] => [
  [0.12, 0.12, 0, 0.06, 0.06, 1.45, p.metal],
  [0, 0, 1.35, 0.3, 0.3, 0.28, p.light, { round: true, className: "glow" }],
];
const bed = (p: Palette, w: number, l = 2.05): Part[] => [
  [0, 0, 0, w, l, 0.34, p.wood],
  [0.05, 0.08, 0.34, w - 0.1, l - 0.12, 0.2, WHITE],
  [0, 0, 0, w, 0.1, 1.0, p.accent],
  [0.12, 0.18, 0.54, w / 2 - 0.2, 0.42, 0.13, PORCELAIN],
  [w / 2 + 0.08, 0.18, 0.54, w / 2 - 0.2, 0.42, 0.13, PORCELAIN],
  [0.05, 0.78, 0.54, w - 0.1, l - 0.86, 0.07, p.textile],
];
const nightstands = (p: Palette, bedW: number): Part[] => [
  [0, 0, 0, 0.45, 0.4, 0.5, p.wood],
  [0.15, 0.12, 0.5, 0.16, 0.16, 0.34, p.light, { round: true, className: "glow" }],
  [bedW + 0.55, 0, 0, 0.45, 0.4, 0.5, p.wood],
  [bedW + 0.7, 0.12, 0.5, 0.16, 0.16, 0.34, p.light, { round: true, className: "glow" }],
];
const wardrobe = (p: Palette, w: number): Part[] => [[0, 0, 0, w, 0.6, 2.1, p.cabinet]];
const desk = (p: Palette, w: number, gaming: boolean): Part[] => {
  const parts: Part[] = [
    [0, 0, 0, w, 0.65, 0.74, p.wood],
    [w / 2 - 0.27, 0.8, 0, 0.54, 0.5, 0.48, gaming ? p.accent2 : p.dark],
    [w / 2 - 0.27, 1.22, 0.48, 0.54, 0.08, 0.6, gaming ? p.accent2 : p.dark],
  ];
  if (gaming) parts.push([w * 0.12, 0.08, 0.74, w * 0.34, 0.05, 0.36, BLACK, { className: "screen" }], [w * 0.54, 0.08, 0.74, w * 0.34, 0.05, 0.36, BLACK, { className: "screen" }]);
  else parts.push([w * 0.3, 0.1, 0.74, w * 0.4, 0.04, 0.3, BLACK, { className: "screen" }]);
  return parts;
};
export const shelf = (p: Palette, w: number, h = 1.9): Part[] => [[0, 0, 0, w, 0.32, h, p.wood]];
const beanbag = (p: Palette): Part[] => [[0, 0, 0, 0.95, 0.95, 0.58, p.accent2, { round: true }]];
export const armchair = (p: Palette): Part[] => [
  [0, 0, 0, 0.8, 0.82, 0.42, p.accent],
  [0, 0, 0.42, 0.8, 0.2, 0.45, p.accent],
];
export const dining = (p: Palette, tw: number, td: number, chairs: number): Part[] => {
  const parts: Part[] = [[0.45, 0.45, 0, tw, td, 0.75, p.wood]];
  const per = Math.max(1, Math.round(chairs / 2));
  for (let i = 0; i < per; i++) {
    const cx = 0.45 + (tw / per) * (i + 0.5) - 0.21;
    parts.push([cx, 0, 0, 0.42, 0.42, 0.46, p.dark], [cx, 0, 0.46, 0.42, 0.06, 0.45, p.dark]);
    parts.push([cx, 0.45 + td + 0.03, 0, 0.42, 0.42, 0.46, p.dark], [cx, 0.45 + td + 0.39, 0.46, 0.42, 0.06, 0.45, p.dark]);
  }
  return parts;
};
export const kitchen = (p: Palette, len: number): Part[] => [
  [0, 0, 0, 0.68, 0.66, 1.95, p.metal],
  [0.7, 0, 0, len - 0.7, 0.62, 0.88, p.cabinet],
  [0.7, 0, 0.88, len - 0.7, 0.64, 0.05, p.counter],
  [0.7, 0, 1.45, len - 0.7, 0.36, 0.72, p.cabinet],
  [0.7 + (len - 0.7) * 0.55, 0.12, 0.935, 0.58, 0.5, 0.01, BLACK, { flat: true }],
  [0.7 + (len - 0.7) * 0.18, 0.12, 0.935, 0.5, 0.4, 0.01, "#b9c0c7", { flat: true }],
];
export const island = (p: Palette, w: number): Part[] => [
  [0, 0, 0, w, 0.85, 0.88, p.cabinet],
  [-0.05, -0.05, 0.88, w + 0.1, 0.95, 0.05, p.counter],
];
export const toilet = (): Part[] => [
  [0, 0, 0, 0.38, 0.18, 0.82, PORCELAIN],
  [0.02, 0.18, 0, 0.34, 0.45, 0.42, PORCELAIN, { round: true }],
];
export const vanity = (p: Palette, w = 0.8): Part[] => [
  [0, 0, 0, w, 0.48, 0.84, p.cabinet],
  [0.15, 0.1, 0.84, w - 0.3, 0.32, 0.03, PORCELAIN],
  [0.05, 0, 1.15, w - 0.1, 0.03, 0.75, "#cfe3ec", { glass: true }],
];
const tub = (): Part[] => [
  [0, 0, 0, 1.7, 0.78, 0.56, PORCELAIN],
  [0.1, 0.1, 0.56, 1.5, 0.58, 0.01, "#9fd3e6", { flat: true, className: "water" }],
];
export const shower = (): Part[] => [
  [0, 0, 0, 0.92, 0.92, 0.04, "#e3e8ec"],
  [0, 0.9, 0, 0.92, 0.03, 2.0, "#cfe3ec", { glass: true }],
  [0.9, 0, 0, 0.03, 0.92, 2.0, "#cfe3ec", { glass: true }],
];
const washer = (): Part[] => [
  [0, 0, 0, 0.6, 0.62, 0.86, PORCELAIN],
  [0, 0, 0.86, 0.6, 0.62, 0.86, PORCELAIN],
  [0.18, 0.62, 0.3, 0.26, 0.01, 0.26, "#9aa3ad", { round: true }],
];
const saunaBenches = (p: Palette, w: number): Part[] => [
  [0, 0, 0.9, w, 0.6, 0.07, "#d6b07a"],
  [0, 0.6, 0.45, w, 0.5, 0.07, "#d6b07a"],
  [w - 0.55, 1.2, 0, 0.45, 0.4, 0.75, "#3a3a3a"],
];
const toys = (p: Palette): Part[] => [
  [0, 0, 0, 0.7, 0.4, 0.45, p.accent],
  [0.9, 0.2, 0, 0.2, 0.2, 0.2, p.accent2],
  [1.15, 0.1, 0, 0.2, 0.2, 0.2, p.textile],
  [1.0, 0.1, 0.2, 0.2, 0.2, 0.2, "#81b29a"],
];

// ---------- per-room furnishing ----------

export function furnish(cfg: Config, rooms: Room[], p: Palette): { items: Item[]; decor: Box[] } {
  seq = 0;
  const items: Item[] = [];
  const decor: Box[] = [];
  const vibe = cfg.vibe;
  const add = (kind: CatalogKind | null, room: Room, u: number, v: number, w: number, d: number, parts: Part[], front = false) => {
    if (u < 0.1 || u + w > room.w - 0.1 + 1e-6 || v < 0 || v + d > room.d + 1e-6) return false;
    const placed = place(room, u, v, w, d, parts, front);
    if (kind) items.push(item(cfg, kind, room, placed));
    else decor.push(...placed.boxes);
    return true;
  };
  const kitchenRoom = rooms.find((r) => r.kind === "kok");
  const kitchenFitsTable = !!kitchenRoom && kitchenRoom.w >= 3.3;
  const wantsDeck = cfg.extras.includes("balkong");
  const bedW = { ungdom: 1.4, skandi: 1.6, lyx: 1.8, familj: 1.8 }[vibe];

  for (const r of rooms) {
    const W = r.w, D = r.d, I = 0.14; // inset from walls
    switch (r.kind) {
      case "vardagsrum": {
        const lounge0 = wantsDeck && r.row === "top" ? Math.min(W - 2.6, 3.1) : 1.9;
        if (cfg.rooms === 1) {
          const sw = 1.9;
          add("sofa", r, Math.max(lounge0, 0.4), I, sw, 0.92, sofa(p, sw, vibe));
          add("coffeeTable", r, Math.max(lounge0, 0.4) + 0.45, 1.3, 1.0, 0.56, coffee(p, vibe));
          add("bedDouble", r, W - bedW - 0.25, I, bedW, 2.05, bed(p, bedW), true);
          add("plant", r, W - 0.7, I + 0.05, 0.5, 0.5, plant(p));
        } else {
          const room = W - lounge0 - 0.3;
          const sw = Math.max(1.9, Math.min(2.8, room - 0.6));
          const u = lounge0 + (room - sw) / 2;
          add("rug", r, u - 0.1, I + 0.95, sw + 0.2, 1.7, rug(p, sw + 0.2, 1.7));
          add("sofa", r, u, I, sw, 0.92, sofa(p, sw, vibe));
          add("coffeeTable", r, u + sw / 2 - 0.55, I + 1.35, 1.1, 0.6, coffee(p, vibe));
          add("tv", r, u + sw / 2 - 0.9, I, 1.8, 0.42, tvBench(p, 1.8), true);
          add(vibe === "ungdom" ? "armchair" : "armchair", r, u + sw + 0.15, I + 1.2, 0.95, 0.95, vibe === "ungdom" ? beanbag(p) : armchair(p));
          add("lamp", r, u - 0.45, I + 0.05, 0.3, 0.3, lamp(p));
          add("plant", r, W - 0.7, I + 0.05, 0.5, 0.5, plant(p));
          if (!kitchenFitsTable && vibe !== "ungdom" && !wantsDeck && lounge0 >= 1.9 && W >= 7) add("dining", r, 0.15, I, 2.3, 1.8, dining(p, 1.4, 0.9, 4));
          if (vibe !== "ungdom" && W > 6.5) add("bookshelf", r, W - 1.2, D - 0.5, 1.0, 0.32, shelf(p, 1.0), true);
        }
        break;
      }
      case "sovrum": {
        const guest = r.name.startsWith("Gäst");
        const bw = guest && vibe !== "lyx" ? 1.2 : bedW;
        const u = Math.max(0.6, (W - bw) / 2);
        add(guest ? "bedSingle" : "bedDouble", r, u, I, bw, 2.05, bed(p, bw));
        add("nightstand", r, u - 0.5, I, bw + 1.0, 0.4, nightstands(p, bw));
        const ww = Math.min(2.0, W - 1.6);
        if (ww >= 1.0) add("wardrobe", r, W - ww - 0.15, I, ww, 0.6, wardrobe(p, ww), true);
        add("plant", r, W - 0.6, I, 0.45, 0.45, plant(p, 0.8));
        break;
      }
      case "barnrum": {
        add("bedSingle", r, W - 1.05, I, 0.9, 2.0, bed(p, 0.9, 2.0));
        add("toys", r, 0.4, I + 0.1, 1.4, 0.45, toys(p));
        add("rug", r, 0.6, I + 0.8, 1.4, 1.1, rug(p, 1.4, 1.1));
        if (W >= 3.2) add("desk", r, W - 2.25, I, 1.0, 1.3, desk(p, 1.0, false), true);
        break;
      }
      case "kontor": {
        const dw = Math.min(1.6, W - 1.0);
        add("desk", r, (W - dw) / 2, I, dw, 1.3, desk(p, dw, vibe === "ungdom"));
        add("bookshelf", r, W - 1.1, I, 0.9, 0.32, shelf(p, 0.9), true);
        add("armchair", r, 0.3, I + 0.1, 0.95, 0.95, vibe === "ungdom" ? beanbag(p) : armchair(p));
        if (vibe === "ungdom") add("toys", r, W - 1.6, I + 1.5, 1.4, 0.45, toys(p));
        break;
      }
      case "kok": {
        const len = Math.min(W - 0.3, 4.6);
        add("kitchen", r, 0.15, I, len, 0.66, kitchen(p, len));
        if (kitchenFitsTable) {
          const big = vibe === "familj" || vibe === "lyx";
          const tw = vibe === "ungdom" ? 0.8 : big ? 1.8 : 1.4;
          add("dining", r, W - tw - 1.15, D - 1.95, tw + 0.9, 1.85, dining(p, tw, 0.9, vibe === "ungdom" ? 2 : big ? 6 : 4));
        }
        if (vibe !== "ungdom" && D >= 3.15 && W >= 4.4) add("island", r, 0.9, I + 1.55, 1.8, 0.95, island(p, 1.8));
        break;
      }
      case "bad": {
        const hasTub = (vibe === "lyx" || vibe === "familj") && W >= 1.95;
        const parts: Part[] = hasTub ? tub() : shower();
        const vx = hasTub ? 1.8 : 1.0;
        const all: Part[] = [...parts];
        if (W - vx >= 0.85) all.push(...vanity(p).map((q) => [q[0] + vx, q[1], q[2], q[3], q[4], q[5], q[6], q[7]] as Part));
        add("bath", r, 0.15, I, Math.min(W - 0.3, vx + 0.85), 0.92, all);
        add(null, r, W - 0.6, D - 0.75, 0.38, 0.63, toilet(), true);
        break;
      }
      case "wc":
        add(null, r, (W - 0.38) / 2, I, 0.38, 0.63, toilet());
        break;
      case "tvatt":
        add("washer", r, 0.2, I, 0.6, 0.62, washer());
        add(null, r, 0.95, I, Math.min(1.2, W - 1.2), 0.4, shelf(p, Math.min(1.2, W - 1.2), 1.6));
        break;
      case "bastu":
        add("sauna", r, 0.15, I, W - 0.3, 1.6, saunaBenches(p, W - 0.3));
        break;
      case "klk":
        add(null, r, 0.15, I, W - 0.3, 0.45, shelf(p, W - 0.3, 2.0));
        break;
      case "hall":
        add(null, r, 1.6, 0.3, Math.min(W - 2.2, 6), 0.8, rug(p, Math.min(W - 2.2, 6), 0.8));
        break;
    }
  }
  return { items, decor };
}

/** Outdoor furniture placed by the site layout (absolute coordinates). */
export function outdoorItem(cfg: Config, kind: "loungers" | "outdoorSofa" | "trampoline", x: number, y: number, p: Palette): Item {
  const label = CATALOG[kind][cfg.vibe];
  let boxes: Box[];
  let w: number, d: number;
  if (kind === "loungers") {
    w = 1.8; d = 1.95;
    boxes = [0, 1.05].flatMap((dx) => [
      { x: x + dx, y, z: 0, w: 0.68, d: 1.95, h: 0.32, color: "#f2efe9" },
      { x: x + dx, y, z: 0.32, w: 0.68, d: 0.5, h: 0.38, color: p.accent },
    ]);
  } else if (kind === "outdoorSofa") {
    w = 2.2; d = 1.9;
    boxes = [
      { x, y, z: 0, w: 2.2, d: 0.85, h: 0.42, color: p.wood },
      { x, y, z: 0.42, w: 2.2, d: 0.2, h: 0.4, color: p.wood },
      { x: x + 0.15, y: y + 0.15, z: 0.42, w: 1.9, d: 0.6, h: 0.1, color: p.textile },
      { x: x + 0.6, y: y + 1.1, z: 0, w: 1.0, d: 0.7, h: 0.44, color: p.dark },
    ];
  } else {
    if (cfg.vibe === "familj") {
      w = 3.4; d = 3.4;
      boxes = [
        { x, y, z: 0, w: 3.4, d: 3.4, h: 0.85, round: true, color: "#2f6fb0", className: "ring" },
        { x: x + 0.25, y: y + 0.25, z: 0.86, w: 2.9, d: 2.9, h: 0.01, round: true, flat: true, color: "#1d1f22" },
      ];
    } else if (cfg.vibe === "skandi") {
      w = 2.6; d = 1.0;
      boxes = [0, 1.4].map((dx) => ({ x: x + dx, y, z: 0, w: 1.2, d: 0.8, h: 0.45, color: "#a77b52" }));
      boxes.push(...[0, 1.4].map((dx) => ({ x: x + dx + 0.08, y: y + 0.08, z: 0.45, w: 1.04, d: 0.64, h: 0.01, flat: true, color: "#5f8f3a" })));
    } else if (cfg.vibe === "lyx") {
      w = 2.2; d = 0.7;
      boxes = [{ x, y, z: 0, w: 2.2, d: 0.7, h: 0.92, color: "#b8bcc2" }, { x: x + 0.2, y: y + 0.1, z: 0.92, w: 0.7, d: 0.5, h: 0.01, flat: true, color: "#1d1f22" }];
    } else {
      w = 2.4; d = 1.0;
      boxes = [
        { x, y: y + 0.4, z: 0, w: 0.1, d: 0.1, h: 1.6, color: "#7a5a3a" },
        { x: x + 2.3, y: y + 0.4, z: 0, w: 0.1, d: 0.1, h: 1.6, color: "#7a5a3a" },
        { x: x + 0.1, y: y + 0.2, z: 0.75, w: 2.2, d: 0.6, h: 0.08, color: p.accent2 },
      ];
    }
  }
  return { id: `o${kind}`, room: "Ute", label, boxes, x, y, w, d };
}
