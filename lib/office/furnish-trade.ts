import type { Ctx, R } from "./furnish";
import { EQUIP } from "./equipment";
import { car, raise } from "./parts";
import * as T from "./parts-trade";

const runs = (from: number, to: number, max: number) => {
  const out: [number, number][] = [];
  for (let a = from; to - a >= 1; a += max + 1.2) out.push([a, Math.min(max, to - a)]);
  return out;
};

const sectioned = (c: Ctx, kind: "gondola" | "wallShelf" | "stockShelf" | "palletRack", len: number, per = 1) => {
  const e = EQUIP[kind][c.cfg.style];
  const n = Math.max(1, Math.round(len / per));
  const unit = kind === "palletRack" ? e.price / 3 : e.price;
  return { name: `${e.name.replace(/, 3 sektioner$/, "")}, ${n} ${n === 1 ? "sektion" : "sektioner"}`, size: `${len.toFixed(1).replace(".", ",")} m`, price: Math.round(n * unit) };
};

function shop(r: R, c: Ctx) {
  const { p, add, cfg } = c;
  const { w: W, d: D } = r;
  const body = cfg.style === "startup" ? "#f4f4f2" : cfg.style === "kreativt" ? p.wood : cfg.style === "exklusiv" ? p.dark : p.cabinet;
  const tills = Math.max(1, Math.ceil(c.staff / 8));
  for (let i = 0; i < tills; i++) add("checkout", r, 2.9 + i * 2.4, 0.5, 1.8, 0.75, T.checkout(p));
  const ow = Math.min(1.6, W * 0.35);
  const wallTo = W > 9 ? W - 0.6 - ow : W - 0.3;
  for (const [u, len] of runs(0.6 + ow, wallTo, 6)) add("wallShelf", r, u, 0.05, len, 0.45, T.wallShelf(p, len, body), true, sectioned(c, "wallShelf", len));
  const v0 = 2.6, v1 = D - 1.7;
  for (let u = 3.0; u + 0.9 <= W - 0.8; u += 2.8)
    for (const [v, len] of runs(v0, v1, 6)) add("gondola", r, u, v, 0.9, len, T.gondola(p, len, body), false, sectioned(c, "gondola", len));
  c.greenery(r, 2.3, 0.2);
  c.greenery(r, W - 0.7, 0.2);
}

function store(r: R, c: Ctx) {
  const { p, add, cfg } = c;
  const { w: W, d: D } = r;
  const port = cfg.industry !== "verkstad";
  const gapA = port ? W / 2 - 1.8 : W - 0.3;
  const gapB = port ? W / 2 + 1.8 : W;
  if (r.name === "Snickeri") {
    add("workbench", r, 0.4, 0.05, 2.0, 0.75, T.workbench(p, 2.0), true);
    add("saw", r, W - 2.6, 0.05, 2.2, 0.8, [[0, 0, 0, 2.2, 0.8, 0.9, "#2f5d8a"], [0.9, 0.2, 0.9, 0.4, 0.4, 0.3, "#c43d3d"]], true);
    if (W > 7) add("palletRack", r, W / 2 + 1.8, 0.14, Math.min(5.4, W / 2 - 2.2), 1.1, T.palletRack(Math.min(5.4, W / 2 - 2.2)), false, sectioned(c, "palletRack", Math.min(5.4, W / 2 - 2.2), 2.7));
    return;
  }
  if (cfg.industry === "bygg") {
    for (const [u, len] of [[0.3, gapA - 0.3], [gapB, W - 0.3 - gapB]] as const)
      if (len >= 1.5) add("palletRack", r, u, 0.14, len, 1.1, T.palletRack(len), false, sectioned(c, "palletRack", len, 2.7));
    add("workbench", r, W - 2.4, 0.05, 2.0, 0.75, T.workbench(p, 2.0), true);
    add("powerTools", r, W - 2.1, 0.15, 1.2, 0.4, raise([[0, 0, 0, 1.2, 0.4, 0.25, "#c43d3d"]], 0.9), true);
    add("toolCabinet", r, W - 3.7, 0.05, 1.2, 0.5, [[0, 0, 0, 1.2, 0.5, 1.9, "#c43d3d"]], true);
    return;
  }
  for (const [u, len] of [[0.3, gapA - 0.3], [gapB, W - 0.3 - gapB]] as const)
    for (const [a, l] of runs(u, u + len, 5)) add("stockShelf", r, a, 0.14, l, 0.5, T.stockShelf(p, l), false, sectioned(c, "stockShelf", l));
  const ow = Math.min(1.6, W * 0.35);
  for (const [a, l] of runs(0.6 + ow, W > 9 ? W - 0.6 - ow : W - 0.3, 5)) add("stockShelf", r, a, 0.05, l, 0.5, T.stockShelf(p, l), true, sectioned(c, "stockShelf", l));
  if (D >= 5.4) for (const [a, l] of runs(2.2, W - 0.4, 5)) add("stockShelf", r, a, 1.9, l, 0.5, T.stockShelf(p, l), false, sectioned(c, "stockShelf", l));
}

const CARS = ["#c43d3d", "#2f5d8a", "#e7e4dd", "#2b3138", "#7d9a78"];

function workshop(r: R, c: Ctx) {
  const { p, add } = c;
  const { w: W, d: D } = r;
  const rows = c.lifts > 8 ? 2 : 1;
  const cols = Math.ceil(c.lifts / rows);
  const bay = W / cols;
  const ow = Math.min(1.6, W * 0.35);
  const blocked = (u: number, w: number) => u < 0.4 + ow + 0.2 || (W > 9 && u + w > W - 0.6 - ow);
  for (let i = 0; i < c.lifts; i++) {
    const k = Math.floor(i / cols), col = i % cols;
    const mid = (col + 0.5) * bay;
    const v = k === 0 ? 0.9 : D / 2 + 0.6;
    c.decor(r, mid - 0.93, v, i % 2 ? raise(car(CARS[i % CARS.length]), 1.25) : car(CARS[i % CARS.length]));
    add("lift", r, mid - 1.5, v + 1.6, 3.0, 0.35, T.lift());
  }
  for (let col = 0; col < cols; col++) {
    const u = (col + 0.5) * bay - 1.0;
    if (!blocked(u, 2.0)) add("workbench", r, u, 0.05, 2.0, 0.75, T.workbench(p, 2.0), true);
  }
  const zone = rows === 2 ? D / 2 - 2.0 : 6.4;
  add("compressor", r, 0.4, zone, 1.2, 0.6, T.compressor());
  if (c.lifts >= 2) add("tyre", r, W - 2.3, zone, 1.9, 0.95, T.tyre());
  const carts = Math.max(1, Math.round(c.lifts / 3));
  for (let i = 0; i < carts; i++) add("diagnostics", r, 2.2 + i * ((W - 5) / carts), zone + 0.1, 0.7, 0.5, T.cart());
}

export function furnishTrade(r: R, c: Ctx) {
  if (r.kind === "butik") shop(r, c);
  else if (r.kind === "verkstad") workshop(r, c);
  else store(r, c);
}
