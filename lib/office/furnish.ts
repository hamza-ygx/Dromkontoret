import { dining, kitchen, place, plant, shower, toilet, vanity, type Part } from "../home/furnish";
import type { Box, CatalogEntry, Item, Room } from "../home/types";
import { EQUIP, TABLEWARE_PER_SEAT, type EquipKind } from "./equipment";
import type { OfficePalette } from "./palette";
import * as P from "./parts";
import { AISLE, TABLE_CELL, barStools, deskGrid, tableGrid, wcCount } from "./programs";
import type { OfficeConfig, OfficeRoomKind } from "./types";

type R = Room<OfficeRoomKind>;
const I = 0.14;
const lift = (parts: Part[], z: number): Part[] => parts.map(([x, v, zz, w, d, h, c, o]) => [x, v, zz + z, w, d, h, c, o]);
const shift = (parts: Part[], dx: number): Part[] => parts.map(([x, v, z, w, d, h, c, o]) => [x + dx, v, z, w, d, h, c, o]);

let seq = 0;

export function siteItem(cfg: OfficeConfig, kind: EquipKind, room: string, x: number, y: number, w: number, d: number, parts: Part[]): Item {
  const boxes = parts.map(([lx, lv, z, bw, bd, h, color, o]) => ({ x: x + lx, y: y + lv, z, w: bw, d: bd, h, color, ...o }) as Box);
  return { id: `s${kind}${seq++}`, room, label: EQUIP[kind][cfg.style], boxes, x, y, w, d };
}

export function furnishOffice(cfg: OfficeConfig, rooms: R[], p: OfficePalette, staff: number, seatTarget: number) {
  seq = 0;
  const s = cfg.style;
  const items: Item[] = [];
  let seats = 0;
  const add = (kind: EquipKind, r: R, u: number, v: number, w: number, d: number, parts: Part[], front = false, label?: Partial<CatalogEntry>) => {
    if (u < 0.1 || u + w > r.w - 0.1 + 1e-6 || v < 0 || v + d > r.d + 1e-6) return false;
    const placed = place(r, u, v, w, d, parts, front);
    items.push({ id: `i${seq++}`, room: r.name, label: { ...EQUIP[kind][s], ...label }, boxes: placed.boxes, ...placed.rect });
    return true;
  };
  const hasDisk = rooms.some((r) => r.kind === "disk");
  const small = !hasDisk;
  const tableware = (r: R, u: number) =>
    add("tableware", r, u, 0.1, 1.2, 0.5, P.tallUnit(p.steel, 1.2, 0.5, 1.8), true, {
      name: `Porslin, glas och bestick (${seatTarget} kuvert)`,
      price: seatTarget * TABLEWARE_PER_SEAT,
    });
  const greenery = (r: R, u: number, v: number, front = false) => add("plant", r, u, v, 0.5, 0.5, plant(p), front);

  for (const r of rooms) {
    const { w: W, d: D } = r;
    switch (r.kind) {
      case "kontor": {
        const g = deskGrid(staff, D);
        const spread = Math.min(1.5, Math.max(0, (W - 3.2 - g.width) / Math.max(1, g.cols)));
        let n = 0;
        for (let c = 0; c < g.cols && n < staff; c++) {
          const u = 0.6 + c * (1.6 + spread) + Math.floor(c / 4) * 1.0;
          if (!g.doubles) {
            if (add("desk", r, u, 0.4, 1.5, P.WORKSTATION_D, P.workstation(p, s, -1))) n++;
            continue;
          }
          for (let k = 0; k < g.doubles && n < staff; k++) {
            const v = 0.4 + k * (P.WORKSTATION_D * 2 + 1.1);
            if (add("desk", r, u, v, 1.5, P.WORKSTATION_D, P.workstation(p, s, 1))) n++;
            if (n < staff && add("desk", r, u, v + P.WORKSTATION_D, 1.5, P.WORKSTATION_D, P.workstation(p, s, -1))) n++;
          }
        }
        const end = g.width + g.cols * spread - 0.2;
        greenery(r, W - 0.7, I + 0.1);
        if (W - end > 2.2) add("storage", r, W - 2.0, I, 1.8, 0.45, P.tallUnit(p.cabinet, 1.8, 0.45, 1.2), true);
        if (staff >= 18) greenery(r, Math.max(end, W - 2.6), I + 0.1);
        break;
      }
      case "reception": {
        const cw = 2.0;
        add("reception", r, Math.max(2.8, (W - cw) / 2 + 0.6), D - 1.5, cw, 1.33, P.counter(p, cw));
        add("waiting", r, W - 2.1, I + 0.1, 1.9, 0.88, P.sofa(p.textile, 1.9));
        greenery(r, 2.6, I + 0.1);
        break;
      }
      case "mote":
      case "konferens":
      case "chambre": {
        const big = r.kind !== "mote";
        const [tw, td, n] = big ? [3.6, 1.1, 10] : [1.8, 0.9, 6];
        const kind: EquipKind = r.kind === "mote" ? "meeting" : r.kind === "konferens" ? "conference" : "chambre";
        add(kind, r, (W - tw - 0.9) / 2, Math.max(0.5, (D - td - 0.9) / 2 - 0.2), tw + 0.9, td + 0.9, dining(p, tw, td, n));
        if (r.kind !== "chambre") add("screen", r, W - 1.65, 0.02, 1.45, 0.06, P.wallScreen(1.45), true);
        else greenery(r, W - 0.7, I + 0.1);
        break;
      }
      case "pentry":
      case "lounge": {
        const len = Math.min(W - 0.3, r.kind === "lounge" ? 4.6 : 3.6);
        add("pentry", r, 0.15, I, len, 0.66, kitchen(p, len));
        if (r.kind === "pentry") {
          add("fika", r, (W - 2.1) / 2, D - 2.5, 2.1, 1.7, dining(p, 1.2, 0.8, 4));
          break;
        }
        add("lounge", r, W - 2.6, 0.2, 2.4, 0.88, P.sofa(p.textile, 2.4), true);
        add("fika", r, W - 2.3, 1.6, 2.1, 1.7, dining(p, 1.2, 0.8, 4));
        const f = P.fun(p, s);
        add("fun", r, Math.max(1.9, W - 2.6 - f.w - 0.6), 0.3, f.w, f.d, f.parts, true);
        break;
      }
      case "gym":
        add("treadmill", r, 0.4, I + 0.2, 0.8, 1.9, P.treadmill());
        add("weights", r, 1.6, I + 0.2, 1.6, 1.95, P.weights(p));
        add("shower", r, W - 1.1, I, 0.95, 0.95, shower(), true);
        break;
      case "wc": {
        const n = Math.min(wcCount(cfg, staff, seatTarget), Math.max(1, Math.floor((D - 0.2) / 1.6)));
        for (let i = 0; i < n; i++) {
          const cubicle: Part[] = [...toilet(), ...shift(vanity(p, 0.6), 0.5)];
          if (i < n - 1) cubicle.push([-((W - 1.1) / 2) + 0.05, 1.5, 0, W - 0.1, 0.05, 2.1, p.wall]);
          add("wc", r, (W - 1.1) / 2, I + i * 1.6, 1.1, 1.6, cubicle, false, n > 1 ? { name: `WC ${i + 1} och tvättställ` } : undefined);
        }
        break;
      }
      case "forrad":
        add("printer", r, 0.3, I, 0.6, 0.6, P.tallUnit("#e8e8e6", 0.6, 0.6, 1.1));
        add("storage", r, 0.3, 0.1, Math.min(1.8, W - 0.6), 0.45, P.tallUnit(p.cabinet, Math.min(1.8, W - 0.6), 0.45, 1.2), true);
        break;
      case "matsal": {
        const want = Math.ceil((seatTarget - barStools(seatTarget)) / 4);
        const { rows } = tableGrid(want, D);
        const cols = Math.floor((W - AISLE - 0.3) / TABLE_CELL);
        let n = 0;
        for (let c = 0; c < cols && n < want; c++)
          for (let k = 0; k < rows && n < want; k++)
            if (add("table4", r, AISLE + c * TABLE_CELL, 0.4 + k * TABLE_CELL, P.TABLE4, 1.8, P.table4(p, s))) n++;
        seats += n * 4;
        greenery(r, 2.2, I + 0.1);
        greenery(r, W - 0.7, D - 0.7);
        break;
      }
      case "bar": {
        const cw = W - 0.8;
        const nStools = Math.min(barStools(seatTarget), Math.max(2, Math.floor(cw / 0.6) - 1));
        add("bar", r, 0.4, D - 2.1, cw, 0.6, P.barCounter(p, cw));
        add("backbar", r, 0.4, 0.05, cw, 0.55, P.backBar(p, cw), true);
        if (add("stools", r, 0.6, D - 2.9, nStools * 0.6, 0.4, P.stools(p, nStools), false, { name: `Barstolar × ${nStools}` })) seats += nStools;
        add("espresso", r, 0.6, D - 2.05, 0.7, 0.5, lift(P.espresso(p), 1.15));
        add("pos", r, cw - 0.3, D - 2.0, 0.35, 0.3, lift(P.pos(), 1.15));
        break;
      }
      case "storkok": {
        const lw = Math.min(3.0, W - 2.8);
        add(small ? "combiSmall" : "combi", r, 0.3, I, 0.9, 0.82, P.combi(p));
        add(small ? "rangeSmall" : "range", r, 1.35, I, lw, 1.1, P.rangeLine(p, lw));
        add("fridge", r, 1.55 + lw, I, 0.7, 0.8, P.tallUnit(p.steel, 0.7, 0.8, 2.0));
        if (D >= 4.2) add("prep", r, 1.0, I + 1.9, Math.min(3.6, W - 2.0), 0.8, P.steelBench(p, Math.min(3.6, W - 2.0), 0.8));
        if (!hasDisk) {
          add("dishSmall", r, W - 3.3, 0.1, 3.1, 0.7, P.dishLine(p), true);
          tableware(r, W - 4.7);
        } else if (W >= 6) add("prep", r, W - 2.0, 0.1, 1.8, 0.7, P.steelBench(p, 1.8), true);
        break;
      }
      case "disk":
        add("dish", r, 0.2, I, 3.1, 0.7, P.dishLine(p));
        tableware(r, W - 1.4);
        break;
      case "kyl":
        if (small) {
          add("fridge", r, 0.2, I, 0.7, 0.8, P.tallUnit(p.steel, 0.7, 0.8, 2.0));
          add("freezerCab", r, 1.0, I, 0.7, 0.8, P.tallUnit("#dfe8f2", 0.7, 0.8, 2.0));
        } else {
          add("coldroom", r, 0.2, I, 2.0, 1.8, P.coldRoom(2.0, 1.8, "#e8ecef"));
          if (W >= 4.6) add("freezer", r, 2.4, I, 2.0, 1.8, P.coldRoom(2.0, 1.8, "#dfe8f2"));
        }
        add("shelving", r, W - 1.3, 0.1, 1.1, 0.5, P.tallUnit(p.steel, 1.1), true);
        break;
      case "personal": {
        const lw = Math.min(2.4, W - 0.6);
        add("lockers", r, 0.3, I, lw, 0.5, P.tallUnit(p.metal, lw), false, { name: `Klädskåp för ${staff} personer`, price: staff * EQUIP.lockers[s].price });
        add("staffTable", r, W - 2.3, 0.6, 2.1, 1.7, dining(p, 1.2, 0.8, 4), true);
        break;
      }
    }
  }
  return { items, seats };
}
