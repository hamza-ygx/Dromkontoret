import type { BudgetId, DestId, Origin, Slot, TripAddon, TripStyle } from "./types";

interface Spot {
  name: string;
  prep: "i" | "på";
}

export const DESTS: { id: DestId; label: string; code: string; beach: Spot; city: Spot; ski?: Spot; safari?: Spot; walls: { wall: string; wallTop: string } }[] = [
  { id: "spanien", label: "Spanien", code: "ES", beach: { name: "Mallorca", prep: "på" }, city: { name: "Barcelona", prep: "i" }, walls: { wall: "#f4e7d4", wallTop: "#b5523b" } },
  { id: "grekland", label: "Grekland", code: "GR", beach: { name: "Kreta", prep: "på" }, city: { name: "Aten", prep: "i" }, walls: { wall: "#fbfbf7", wallTop: "#1f5fa8" } },
  { id: "italien", label: "Italien", code: "IT", beach: { name: "Amalfikusten", prep: "på" }, city: { name: "Rom", prep: "i" }, ski: { name: "Cortina d'Ampezzo", prep: "i" }, walls: { wall: "#f1dcc0", wallTop: "#a8553a" } },
  { id: "portugal", label: "Portugal", code: "PT", beach: { name: "Algarve", prep: "i" }, city: { name: "Lissabon", prep: "i" }, walls: { wall: "#f7f3ea", wallTop: "#c98b2b" } },
  { id: "kroatien", label: "Kroatien", code: "HR", beach: { name: "Split", prep: "i" }, city: { name: "Dubrovnik", prep: "i" }, walls: { wall: "#efe6d6", wallTop: "#b4472f" } },
  { id: "frankrike", label: "Frankrike", code: "FR", beach: { name: "Nice", prep: "i" }, city: { name: "Paris", prep: "i" }, ski: { name: "Chamonix", prep: "i" }, walls: { wall: "#efe9df", wallTop: "#3c4a5c" } },
  { id: "turkiet", label: "Turkiet", code: "TR", beach: { name: "Antalya", prep: "i" }, city: { name: "Istanbul", prep: "i" }, walls: { wall: "#f6efe4", wallTop: "#9a3b2e" } },
  { id: "egypten", label: "Egypten", code: "EG", beach: { name: "Hurghada", prep: "i" }, city: { name: "Kairo", prep: "i" }, walls: { wall: "#efdfbf", wallTop: "#8c6a3c" } },
  { id: "thailand", label: "Thailand", code: "TH", beach: { name: "Phuket", prep: "på" }, city: { name: "Bangkok", prep: "i" }, walls: { wall: "#f5efe3", wallTop: "#7a4e2d" } },
  { id: "usa", label: "USA", code: "US", beach: { name: "Florida", prep: "i" }, city: { name: "New York", prep: "i" }, ski: { name: "Aspen", prep: "i" }, walls: { wall: "#eef0f2", wallTop: "#33475b" } },
  { id: "japan", label: "Japan", code: "JP", beach: { name: "Okinawa", prep: "på" }, city: { name: "Tokyo", prep: "i" }, ski: { name: "Niseko", prep: "i" }, walls: { wall: "#f3efe6", wallTop: "#2b2b2b" } },
  { id: "sverige", label: "Sverige", code: "SE", beach: { name: "Gotland", prep: "på" }, city: { name: "Stockholm", prep: "i" }, ski: { name: "Åre", prep: "i" }, walls: { wall: "#f4f1ea", wallTop: "#a3322a" } },
];

export const destById = (id: DestId) => DESTS.find((d) => d.id === id)!;

export const BUDGETS: { id: BudgetId; label: string; min: number; max: number }[] = [
  { id: "50-100", label: "50–100", min: 50_000, max: 100_000 },
  { id: "100-250", label: "100–250", min: 100_000, max: 250_000 },
  { id: "250-500", label: "250–500", min: 250_000, max: 500_000 },
  { id: "500-1000", label: "500–1 000", min: 500_000, max: 1_000_000 },
  { id: "1000+", label: "1 000 +", min: 1_000_000, max: Infinity },
];

export const budgetById = (id: BudgetId) => BUDGETS.find((b) => b.id === id)!;
export const budgetText = (id: BudgetId) => (id === "1000+" ? "över 1 Mkr" : `${budgetById(id).label} tkr`);

export const ORIGINS: { id: Origin; label: string; airport: string; lat: number; lon: number }[] = [
  { id: "arlanda", label: "Stockholm", airport: "Arlanda", lat: 59.65, lon: 17.92 },
  { id: "landvetter", label: "Göteborg", airport: "Landvetter", lat: 57.67, lon: 12.29 },
  { id: "kastrup", label: "Malmö", airport: "via Kastrup", lat: 55.62, lon: 12.65 },
];

export const originById = (id: Origin) => ORIGINS.find((o) => o.id === id)!;

export const LIMITS = { adults: [1, 10], kids: [0, 6], nights: [2, 30] } as const;

export const NIGHT_PRESETS: { nights: number; label: string }[] = [
  { nights: 4, label: "Långhelg" },
  { nights: 7, label: "1 vecka" },
  { nights: 14, label: "2 veckor" },
  { nights: 21, label: "3 veckor" },
];

export const TRIP_STYLES: { id: TripStyle; label: string; hint: string; swatch: string[]; slot: Slot; dests?: DestId[] }[] = [
  { id: "sol", label: "Sol & bad", hint: "Strand, pool och långa luncher", swatch: ["#f2d48f", "#3fb3d6", "#ff8a5c"], slot: "beach" },
  { id: "stad", label: "Storstad", hint: "Shopping, museer och restauranger", swatch: ["#3c4a5c", "#c9a24b", "#e8e4dc"], slot: "city" },
  { id: "aventyr", label: "Äventyr & natur", hint: "Vandring, dykning och båtturer", swatch: ["#4f7a4a", "#2f8fbf", "#d9a066"], slot: "beach" },
  { id: "kultur", label: "Mat & kultur", hint: "Matmarknader, vin och historia", swatch: ["#7a2e3a", "#d9b26f", "#f4ede0"], slot: "city" },
  { id: "skidor", label: "Skidor & alper", hint: "Pudersnö, liftar och afterski", swatch: ["#e9f0f6", "#3d5a80", "#c8a45c"], slot: "ski" },
  { id: "golf", label: "Golf", hint: "Banor i världsklass och sol", swatch: ["#3f7d4e", "#e8dcc0", "#ffffff"], slot: "beach", dests: ["spanien", "portugal", "turkiet", "usa", "sverige", "frankrike"] },
  { id: "spa", label: "Spa & wellness", hint: "Behandlingar, yoga och lugn", swatch: ["#d9c7b8", "#8fb3a8", "#f6f1ea"], slot: "beach" },
  { id: "safari", label: "Safari", hint: "Big five från öppen jeep", swatch: ["#b08850", "#5c6b3a", "#e8d9b5"], slot: "safari" },
];

export const styleById = (id: TripStyle) => TRIP_STYLES.find((t) => t.id === id)!;

export const TRIP_ADDONS: { id: TripAddon; label: string }[] = [
  { id: "bil", label: "Hyrbil" },
  { id: "allinc", label: "Allt inkluderat" },
  { id: "utflykt", label: "Utflykter med guide" },
  { id: "skydd", label: "Avbeställningsskydd" },
];

export const STANDARD_LABEL = { budget: "Budget", mellan: "Mellan", lyx: "Lyx", ultra: "Ultralyx", jet: "Privatjet" } as const;
