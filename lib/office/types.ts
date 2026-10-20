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
