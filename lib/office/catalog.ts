import type { Addon, Headcount, Industry, Style } from "./types";

export const INDUSTRIES: { id: Industry; label: string; hint: string; company: string }[] = [
  { id: "konsult", label: "Konsult / byrå", hint: "Kontor med skrivbord och mötesrum", company: "Konsultbyrå" },
  { id: "bygg", label: "Bygg & hantverk", hint: "Kontor, förråd och gård med bil", company: "Byggfirma" },
  { id: "restaurang", label: "Restaurang / café", hint: "Matsal, bar och storkök", company: "Restaurang" },
  { id: "butik", label: "Butik", hint: "Butiksyta, kassa och lager", company: "Butik" },
  { id: "verkstad", label: "Verkstad / lager", hint: "Verkstadshall, kontor och fikarum", company: "Verkstad" },
];

export const HEADCOUNTS: { id: Headcount; label: string; staff: number }[] = [
  { id: "1", label: "1", staff: 1 },
  { id: "2-5", label: "2–5", staff: 4 },
  { id: "6-10", label: "6–10", staff: 8 },
  { id: "11-25", label: "11–25", staff: 18 },
  { id: "26-50", label: "26–50", staff: 35 },
];

export const STYLES: { id: Style; label: string; hint: string; swatch: string[] }[] = [
  { id: "startup", label: "Startup", hint: "Färg, sittsäckar och pingis", swatch: ["#2ec4b6", "#ff6b9a", "#ffd23f"] },
  { id: "skandi", label: "Skandinaviskt", hint: "Ljust, ek, växter och lugn", swatch: ["#f4f1ea", "#c9a77c", "#7d9a78"] },
  { id: "exklusiv", label: "Exklusivt", hint: "Valnöt, läder och mässing", swatch: ["#1d2a24", "#2f5d50", "#c9a24b"] },
  { id: "kreativt", label: "Kreativt", hint: "Betong, tegel och konst", swatch: ["#8d8a85", "#b5523b", "#3d5a80"] },
];

export const ADDONS: { id: Addon; label: string; byIndustry?: Partial<Record<Industry, string>> }[] = [
  { id: "konferens", label: "Konferensrum", byIndustry: { restaurang: "Chambre séparée" } },
  { id: "lounge", label: "Personalkök / lounge", byIndustry: { restaurang: "Personalrum" } },
  { id: "gym", label: "Gym & dusch" },
  { id: "parkering", label: "Parkering med laddplatser" },
];

export const addonLabel = (a: Addon, industry: Industry) => {
  const e = ADDONS.find((x) => x.id === a)!;
  return e.byIndustry?.[industry] ?? e.label;
};

export const staffFor = (size: Headcount) => HEADCOUNTS.find((h) => h.id === size)!.staff;
