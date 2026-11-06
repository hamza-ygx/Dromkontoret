import type { Plan } from "../home/types";

export type DestId = "sverige" | "spanien" | "grekland" | "italien" | "portugal" | "kroatien" | "turkiet" | "frankrike" | "thailand" | "usa" | "egypten" | "japan";
export type Budget = 15_000 | 30_000 | 50_000 | 80_000 | 150_000;
export type Party = "1" | "2" | "2+2" | "4";
export type Nights = 4 | 7 | 10 | 14;
export type TripStyle = "sol" | "stad" | "aventyr" | "kultur";
export type TripAddon = "bil" | "allinc" | "utflykt" | "skydd";
export type Standard = "budget" | "mellan" | "lyx";

export interface TripConfig {
  dest: DestId;
  budget: Budget;
  party: Party;
  nights: Nights;
  style: TripStyle;
  addons: TripAddon[];
}

export interface CostLine {
  id: "flyg" | "boende" | "mat" | "aktiviteter" | "transport" | "skydd";
  label: string;
  detail: string;
  amount: number;
}

export interface Trip {
  standard: Standard;
  lines: CostLine[];
  total: number;
  fits: boolean;
}

export interface TripPlan {
  config: TripConfig;
  trip: Trip;
  options: Trip[];
  place: string;
  title: string;
  home: Plan;
  beach: boolean;
}
