export type DestId = "sverige" | "spanien" | "grekland" | "italien" | "portugal" | "kroatien" | "turkiet" | "frankrike" | "thailand" | "usa" | "egypten" | "japan" | "maldiverna" | "dubai" | "bali" | "mexiko" | "island" | "schweiz" | "sydafrika" | "karibien";
export type BudgetId = "50-100" | "100-250" | "250-500" | "500-1000" | "1000+";
export type Slot = "beach" | "city" | "ski" | "safari";
export type Origin = "arlanda" | "landvetter" | "kastrup";
export type TripStyle = "sol" | "stad" | "aventyr" | "kultur" | "skidor" | "golf" | "spa" | "safari";
export type TripAddon = "bil" | "allinc" | "utflykt" | "skydd";
export type BaseStandard = "budget" | "mellan" | "lyx";
export type Standard = BaseStandard | "ultra" | "jet";

export interface TripConfig {
  dest: DestId;
  budget: BudgetId;
  adults: number;
  kids: number;
  nights: number;
  from: Origin;
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
  slot: Slot;
}
