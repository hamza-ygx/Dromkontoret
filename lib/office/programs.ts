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
}

export interface Program {
  top: Spec[];
  bottom: Spec[];
  T: number;
  B: number;
  corridor: string;
  target: number;
  seats: number;
}

export const MIN_W: Record<OfficeRoomKind, number> = {
  kontor: 3.0, reception: 2.6, mote: 3.3, konferens: 4.6, pentry: 2.6, lounge: 3.8, gym: 3.6, wc: 1.4, forrad: 1.8,
  matsal: 4.6, bar: 3.4, storkok: 4.2, disk: 3.4, kyl: 2.6, personal: 2.6, chambre: 4.4, hall: 1,
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

function addons(cfg: OfficeConfig, staff: number, top: Spec[]) {
  if (cfg.addons.includes("gym")) top.push({ kind: "gym", name: addonLabel("gym", cfg.industry), area: clamp(staff * 0.7, 16, 32), move: true });
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
  return { top, bottom, T, B, corridor: "Korridor", target: Math.max(SPACE.officeMin, staff * SPACE.officePerStaff), seats: 0 };
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
  return { top, bottom, T, B, corridor: "Serveringsgång", target: 0, seats };
}

export function program(cfg: OfficeConfig, staff: number): Program {
  return cfg.industry === "restaurang" ? restaurang(cfg, staff) : konsult(cfg, staff);
}
