import type { Model3D } from "../home/types";

export type Industry = "konsult" | "bygg" | "restaurang" | "butik" | "verkstad";
export type Headcount = "1" | "2-5" | "6-10" | "11-25" | "26-50";
export type Style = "startup" | "skandi" | "exklusiv" | "kreativt";
export type Addon = "konferens" | "lounge" | "gym" | "parkering";

export interface OfficeConfig {
  industry: Industry;
  size: Headcount;
  style: Style;
  area: string;
  addons: Addon[];
}

export type OfficeRoomKind =
  | "kontor"
  | "reception"
  | "mote"
  | "konferens"
  | "pentry"
  | "lounge"
  | "gym"
  | "wc"
  | "forrad"
  | "matsal"
  | "bar"
  | "storkok"
  | "disk"
  | "kyl"
  | "personal"
  | "chambre"
  | "butik"
  | "lager"
  | "verkstad"
  | "hall";

export interface OfficePlan extends Model3D<OfficeRoomKind> {
  config: OfficeConfig;
  staff: number;
  width: number;
  depth: number;
  floorArea: number;
  seats: number;
  metric: { value: string; label: string };
  title: string;
}
