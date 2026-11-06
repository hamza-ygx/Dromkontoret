export type DestId = "sverige" | "spanien" | "grekland" | "italien" | "portugal" | "kroatien" | "turkiet" | "frankrike" | "thailand" | "usa" | "egypten" | "japan";
export type BudgetId = "50-100" | "100-250" | "250-500" | "500-1000" | "1000+";
export type Party = "1" | "2" | "2+2" | "4";
export type Nights = 4 | 7 | 10 | 14;
export type TripStyle = "sol" | "stad" | "aventyr" | "kultur";
export type TripAddon = "bil" | "allinc" | "utflykt" | "skydd";
export type BaseStandard = "budget" | "mellan" | "lyx";
export type Standard = BaseStandard | "ultra" | "jet";

export interface TripConfig {
  dest: DestId;
  budget: BudgetId;
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
  beach: boolean;
}
