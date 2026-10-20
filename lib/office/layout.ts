import { placeById, preposition } from "../home/places";
import type { Opening, Room, WallRun } from "../home/types";
import { INDUSTRIES, staffFor } from "./catalog";
import { furnishOffice } from "./furnish";
import { OFFICE_PALETTE } from "./palette";
import { MIN_W, program, type Spec } from "./programs";
import { buildSite } from "./site";
import type { OfficeConfig, OfficePlan, OfficeRoomKind } from "./types";

const CORRIDOR = 1.6;
const r1 = (v: number) => Math.round(v * 10) / 10;
const DARK: OfficeRoomKind[] = ["wc", "forrad", "kyl", "disk", "lager", "verkstad"];
const SHOWCASE: OfficeRoomKind[] = ["matsal", "reception", "bar", "chambre", "butik"];
const WIDE: OfficeRoomKind[] = ["kontor", "matsal", "reception", "lounge", "storkok", "butik", "lager", "verkstad"];
const ORDER: OfficeRoomKind[] = ["lager", "kontor", "storkok", "disk", "kyl", "pentry", "lounge", "personal", "gym", "reception", "matsal", "bar", "butik", "verkstad", "mote", "konferens", "chambre", "forrad", "wc"];

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
  const ports = (r: Room<OfficeRoomKind>): Opening[] => {
    const n = specOf(r).ports ?? 0;
    return Array.from({ length: n }, (_, i) => {
      const m = r.x + ((i + 0.5) * r.w) / n;
      return { a: m - 1.5, b: m + 1.5, kind: "opening" };
    });
  };
  const north = topRooms.flatMap((r) => (specOf(r).ports ? ports(r) : DARK.includes(r.kind) ? [] : windows(r.x, r.x + r.w, 1.8)));
  walls.push({ id: "n", axis: "h", at: 0, from: 0, to: W, exterior: true, side: "n", openings: north });
  const south = botRooms.flatMap((r): Opening[] => {
    if (specOf(r).ports) return ports(r);
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

  const { site, items: extra, bounds } = buildSite(cfg, pal, rooms, W, D, staff, prog.vans);
  const { items, seats, decor } = furnishOffice(cfg, rooms, pal, staff, prog.seats, prog.lifts);
  site.push(...decor);
  const count = (n: number, one: string, many: string) => ({ value: String(n), label: n === 1 ? one : many });
  const shop = rooms.find((r) => r.kind === "butik");
  const metric = {
    konsult: () => count(items.filter((i) => i.label.name.startsWith("Arbetsplats")).length, "arbetsplats", "arbetsplatser"),
    restaurang: () => count(seats, "sittplats", "sittplatser"),
    bygg: () => count(prog.vans, "servicebil", "servicebilar"),
    butik: () => ({ value: `${Math.round(shop ? shop.w * shop.d : 0)} m²`, label: "butiksyta" }),
    verkstad: () => count(prog.lifts, "billyft", "billyftar"),
  }[cfg.industry]();
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
    bounds,
    floorArea: Math.round(W * D),
    seats,
    metric,
    title: `${company} ${preposition(place)} ${place.name}`,
  };
}
