export type HomeType = "lagenhet" | "radhus" | "villa" | "stuga";
export type Vibe = "ungdom" | "skandi" | "lyx" | "familj";
export type Extra = "balkong" | "pool" | "bastu" | "tradgard";

export interface Config {
  type: HomeType;
  rooms: 1 | 2 | 3 | 4 | 5;
  vibe: Vibe;
  area: string;
  extras: Extra[];
}

export type RoomKind =
  | "vardagsrum"
  | "sovrum"
  | "barnrum"
  | "kontor"
  | "kok"
  | "bad"
  | "wc"
  | "tvatt"
  | "bastu"
  | "klk"
  | "hall";

export interface Rect {
  x: number;
  y: number;
  w: number;
  d: number;
}

export interface Room<K extends string = RoomKind> extends Rect {
  id: string;
  kind: K;
  name: string;
  row: "top" | "bottom" | "corridor";
}

export type OpeningKind = "door" | "opening" | "window" | "glassdoor";

export interface Opening {
  a: number;
  b: number;
  kind: OpeningKind;
}

/** A straight wall run; horizontal runs go along x at fixed y, vertical along y at fixed x. */
export interface WallRun {
  id: string;
  axis: "h" | "v";
  at: number;
  from: number;
  to: number;
  exterior: boolean;
  side: "n" | "s" | "e" | "w" | "ih" | "iv";
  openings: Opening[];
}

export interface Box {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  /** Only draw the top face (floors, rugs, water). */
  flat?: boolean;
  glass?: boolean;
  round?: boolean;
  className?: string;
}

export interface CatalogEntry {
  name: string;
  size: string;
  price: number;
  store: string;
}

export interface Item {
  id: string;
  room: string;
  label: CatalogEntry;
  boxes: Box[];
  /** Footprint, for highlighting. */
  x: number;
  y: number;
  w: number;
  d: number;
}

export interface Model3D<K extends string = string> {
  rooms: Room<K>[];
  walls: WallRun[];
  /** Ground, garden, water, outdoor structures (not purchasable). */
  site: Box[];
  items: Item[];
  bounds: Rect;
}

export interface Plan extends Model3D<RoomKind> {
  config: Config;
  width: number;
  depth: number;
  livingArea: number;
  title: string;
}
