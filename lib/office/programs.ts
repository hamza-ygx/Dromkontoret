import { addonLabel } from "./catalog";
import { WORKSTATION_D } from "./parts";
import { SPACE } from "./rates";
import type { OfficeConfig, OfficeRoomKind } from "./types";

export interface Spec {
  kind: OfficeRoomKind;
  name: string;
  area: number;
  move?: boolean;
  join?: boolean;
  grow?: boolean;
  entry?: boolean;
  min?: number;
  ports?: number;
}

export interface Program {
  top: Spec[];
  bottom: Spec[];
  T: number;
  B: number;
  corridor: string;
  target: number;
  seats: number;
  lifts: number;
  vans: number;
}

export const MIN_W: Record<OfficeRoomKind, number> = {
  kontor: 3.0, reception: 2.6, mote: 3.3, konferens: 4.6, pentry: 2.6, lounge: 3.8, gym: 3.6, wc: 1.4, forrad: 1.8,
  matsal: 4.6, bar: 3.4, storkok: 4.2, disk: 3.4, kyl: 2.6, personal: 2.6, chambre: 4.4, butik: 5.0, lager: 3.4, verkstad: 5.0, hall: 1,
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const numbered = (name: string, n: number, i: number) => (n > 1 ? `${name} ${i + 1}` : name);

export const TABLE_CELL = 2.05;
export const AISLE = 2.6;

export function tableGrid(tables: number, depth: number) {
  const rows = Math.max(1, Math.floor((depth - 1.6) / TABLE_CELL));
  return { rows, width: AISLE + Math.ceil(tables / rows) * TABLE_CELL + 0.4 };
}

export function deskGrid(staff: number, depth: number) {
  const avail = depth - 0.4 - 1.3;
  const pair = WORKSTATION_D * 2;
  const doubles = avail + 1e-6 >= pair ? Math.max(1, Math.floor((avail + 1.1 + 1e-6) / (pair + 1.1))) : 0;
  const perCol = doubles ? doubles * 2 : 1;
  const cols = Math.ceil(staff / perCol);
  const width = 0.6 + cols * 1.6 + Math.floor((cols - 1) / 4) * 1.0 + 0.6;
  return { doubles, cols, width };
}

export const wcCount = (cfg: OfficeConfig, staff: number, seats: number) =>
  cfg.industry === "restaurang" ? (seats > 100 ? 3 : seats > 40 ? 2 : 1) : Math.ceil(staff / 15);

const toilets = (n: number): Spec => ({ kind: "wc", name: n > 1 ? "Toaletter" : "WC", area: n * 2.6, min: n > 1 ? 1.9 : 1.4 });

function addons(cfg: OfficeConfig, staff: number, top: Spec[], bottom?: Spec[]) {
  if (cfg.addons.includes("gym")) top.push({ kind: "gym", name: addonLabel("gym", cfg.industry), area: clamp(staff * 0.7, 16, 32), move: true });
  if (bottom && cfg.addons.includes("konferens")) bottom.push({ kind: "konferens", name: "Konferensrum", area: Math.max(20, staff * 0.9), move: true });
}

const staffRoom = (cfg: OfficeConfig, staff: number, name = "Personalrum"): Spec => {
  const lounge = cfg.addons.includes("lounge");
  return { kind: "personal", name: lounge ? `${name} & lounge` : name, area: Math.max(7, staff * (lounge ? 1.6 : 1.0)), move: true };
};

export function deskCount(cfg: OfficeConfig, staff: number) {
  if (cfg.industry === "konsult") return staff;
  if (cfg.industry === "bygg") return staff === 1 ? 1 : Math.max(1, Math.round(staff * SPACE.byggOfficeShare));
  if (cfg.industry === "butik") return staff >= 6 ? Math.ceil(staff / 10) : 0;
  if (cfg.industry === "verkstad") return staff >= 6 ? Math.ceil(staff * 0.15) : 0;
  return 0;
}

export const liftCount = (staff: number) => Math.max(1, Math.round(staff * SPACE.liftsPerStaff));
export const vanCount = (staff: number) => clamp(Math.ceil(staff * SPACE.vansPerStaff), 1, 8);
export const shopArea = (staff: number) => Math.max(40, Math.round(SPACE.shopSalesBase * staff ** SPACE.shopSalesExponent));
const office = (desks: number, depth: number, front: boolean) => (deskGrid(desks, depth).width + (front ? 2.2 : 0)) * depth;

const base = { target: 0, seats: 0, lifts: 0, vans: 0 };

function bygg(cfg: OfficeConfig, staff: number): Program {
  const desks = deskCount(cfg, staff);
  const storage = Math.max(24, Math.max(1, staff - desks) * SPACE.storagePerTrade);
  const T = staff <= 10 ? 4.8 : 6.4;
  const B = desks <= 2 ? 4.6 : 5.6;
  const bottom: Spec[] = [{ kind: "kontor", name: "Kontor", area: office(desks, B, true), entry: true }];
  if (staff >= 4) bottom.push({ kind: "lager", name: "Snickeri", area: storage * 0.45, grow: true, ports: 1 });
  if (staff >= 11) bottom.push({ kind: "mote", name: "Mötesrum", area: 12, move: true });
  const top: Spec[] = [
    { kind: "lager", name: "Lager & verktyg", area: staff >= 4 ? storage * 0.55 : storage, grow: true, ports: 1 },
    staffRoom(cfg, staff, "Omklädning & lunchrum"),
  ];
  bottom.push(toilets(wcCount(cfg, staff, 0)));
  addons(cfg, staff, top, bottom);
  return { ...base, top, bottom, T, B, corridor: "Korridor", vans: vanCount(staff) };
}

function butik(cfg: OfficeConfig, staff: number): Program {
  const sales = shopArea(staff);
  const B = sales <= 80 ? 7 : sales <= 250 ? 10 : 15;
  const T = sales <= 250 ? 4.4 : 5.6;
  const bottom: Spec[] = [{ kind: "butik", name: "Butik", area: sales, grow: true, entry: true }];
  const top: Spec[] = [{ kind: "lager", name: "Lager", area: Math.max(8, sales * SPACE.stockShare), grow: true, ports: 1 }];
  const desks = deskCount(cfg, staff);
  if (desks) top.push({ kind: "kontor", name: "Kontor", area: office(desks, T, false), move: true });
  if (staff > 1 || cfg.addons.includes("lounge")) top.push(staffRoom(cfg, staff));
  top.push(toilets(wcCount(cfg, staff, 0)));
  addons(cfg, staff, top, bottom);
  return { ...base, top, bottom, T, B, corridor: "Personalgång" };
}

export const BAY = 4.5;

function verkstad(cfg: OfficeConfig, staff: number): Program {
  const lifts = liftCount(staff);
  const rows = lifts > 8 ? 2 : 1;
  const cols = Math.ceil(lifts / rows);
  const B = rows === 2 ? 19 : 10.5;
  const T = staff <= 10 ? 4.4 : 5.6;
  const bottom: Spec[] = [
    { kind: "reception", name: "Kundmottagning", area: staff >= 6 ? 16 : 10, entry: true, min: 4.2 },
    { kind: "verkstad", name: "Verkstadshall", area: (cols * BAY + 0.6) * B, grow: true, ports: cols },
  ];
  const top: Spec[] = [{ kind: "lager", name: "Reservdelslager", area: Math.max(10, lifts * 3), grow: true }];
  const desks = deskCount(cfg, staff);
  if (desks) top.push({ kind: "kontor", name: "Kontor", area: office(desks, T, false), move: true });
  top.push(staffRoom(cfg, staff, "Omklädning & lunchrum"));
  top.push(toilets(wcCount(cfg, staff, 0)));
  addons(cfg, staff, top, bottom);
  return { ...base, top, bottom, T, B, corridor: "Korridor", lifts };
}

function konsult(cfg: OfficeConfig, staff: number): Program {
  const T = staff === 1 ? 4.0 : staff <= 5 ? 4.6 : staff <= 10 ? 5.6 : 8.6;
  const B = staff === 1 ? 3.2 : staff <= 10 ? 4.2 : 4.8;
  const top: Spec[] = [{ kind: "kontor", name: staff === 1 ? "Kontor" : "Kontorslandskap", area: deskGrid(staff, T).width * T, grow: true }];
  const bottom: Spec[] = [{ kind: "reception", name: staff >= 6 ? "Reception" : "Entré", area: staff >= 6 ? clamp(staff * 0.8, 12, 26) : 6, entry: true }];
  const meetings = staff === 1 ? 0 : staff <= 10 ? 1 : Math.ceil(staff / 9);
  for (let i = 0; i < meetings; i++) bottom.push({ kind: "mote", name: numbered("Mötesrum", meetings, i), area: 12, move: true });
  if (cfg.addons.includes("konferens")) bottom.push({ kind: "konferens", name: "Konferensrum", area: Math.max(24, staff * 0.9), move: true });
  const lounge = cfg.addons.includes("lounge");
  top.push({ kind: lounge ? "lounge" : "pentry", name: lounge ? "Personalkök & lounge" : "Pentry", area: lounge ? Math.max(18, staff * 2.4) : Math.max(8, staff * 1.2), move: true });
  if (staff >= 6) bottom.push({ kind: "forrad", name: "Kopiering & förråd", area: staff >= 18 ? 9 : 6 });
  bottom.push(toilets(wcCount(cfg, staff, 0)));
  addons(cfg, staff, top);
  return { ...base, top, bottom, T, B, corridor: "Korridor", target: Math.max(SPACE.officeMin, staff * SPACE.officePerStaff) };
}

export const barStools = (seats: number) => (seats <= 30 ? 4 : seats <= 80 ? 6 : 8);

function restaurang(cfg: OfficeConfig, staff: number): Program {
  const seats = Math.max(SPACE.minSeats, Math.round((staff * SPACE.seatsPerStaff) / 2) * 2);
  const dining = seats * SPACE.diningPerSeat;
  const B = seats <= 30 ? 6.0 : seats <= 80 ? 8.0 : 10.2;
  const tables = Math.ceil((seats - barStools(seats)) / 4);
  const T = seats <= 40 ? 4.2 : 5.2;
  const small = seats <= 30;
  const kitchen = (dining / (1 - SPACE.kitchenShare)) * SPACE.kitchenShare;
  const top: Spec[] = [{ kind: "storkok", name: small ? "Kök" : "Storkök", area: small ? kitchen : kitchen * 0.7, grow: true }];
  if (!small) top.push({ kind: "disk", name: "Disk", area: kitchen * 0.3 });
  top.push({ kind: "kyl", name: "Kyl & förråd", area: Math.max(6, seats * 0.12) });
  const lounge = cfg.addons.includes("lounge");
  if (staff > 1 || lounge) top.push({ kind: "personal", name: lounge ? "Personalrum & vila" : "Personalrum", area: Math.max(7, staff * (lounge ? 1.6 : 0.9)), move: true });
  const bottom: Spec[] = [
    { kind: "matsal", name: "Matsal", area: Math.max(dining, tableGrid(tables, B).width * B), grow: true, entry: true },
    { kind: "bar", name: seats <= 30 ? "Kaffebar" : "Bar", area: Math.max(10, seats * 0.25), join: true },
  ];
  if (cfg.addons.includes("konferens")) bottom.push({ kind: "chambre", name: addonLabel("konferens", cfg.industry), area: 22, move: true });
  bottom.push(toilets(wcCount(cfg, staff, seats)));
  addons(cfg, staff, top);
  return { ...base, top, bottom, T, B, corridor: "Serveringsgång", seats };
}

const PROGRAMS = { konsult, restaurang, bygg, butik, verkstad };

export function program(cfg: OfficeConfig, staff: number): Program {
  return PROGRAMS[cfg.industry](cfg, staff);
}
