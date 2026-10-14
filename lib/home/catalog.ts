import type { CatalogEntry, Extra, HomeType, Vibe } from "./types";

export const TYPES: { id: HomeType; label: string; hint: string }[] = [
  { id: "lagenhet", label: "Lägenhet", hint: "Bostadsrätt med balkong" },
  { id: "radhus", label: "Radhus", hint: "Egen täppa, grannar på sidorna" },
  { id: "villa", label: "Villa", hint: "Fristående hus med tomt" },
  { id: "stuga", label: "Sommarstuga", hint: "Sjönära med brygga" },
];

export const VIBES: { id: Vibe; label: string; hint: string; swatch: string[] }[] = [
  { id: "ungdom", label: "Ungdom", hint: "Första boendet – färg, gaming, budget", swatch: ["#2ec4b6", "#ff6b9a", "#ffd23f"] },
  { id: "skandi", label: "Skandinaviskt", hint: "Ljust, ek, växter och lugn", swatch: ["#f4f1ea", "#c9a77c", "#7d9a78"] },
  { id: "lyx", label: "Lyx", hint: "Marmor, sammet och mässing", swatch: ["#1d2a24", "#2f5d50", "#c9a24b"] },
  { id: "familj", label: "Familj", hint: "Barnrum, stort matbord, tåligt", swatch: ["#f2e3c6", "#e07a5f", "#3d85c6"] },
];

export const EXTRAS: { id: Extra; label: string; byType: Partial<Record<HomeType, string>> }[] = [
  { id: "balkong", label: "Balkong / terrass", byType: { lagenhet: "Balkong", radhus: "Trädäck", villa: "Trädäck", stuga: "Trädäck" } },
  { id: "pool", label: "Pool / jacuzzi", byType: { lagenhet: "Jacuzzi på terrassen", radhus: "Pool", villa: "Pool", stuga: "Badtunna" } },
  { id: "bastu", label: "Bastu", byType: { lagenhet: "Bastu", radhus: "Bastu", villa: "Bastu", stuga: "Bastu vid sjön" } },
  { id: "tradgard", label: "Garage + trädgård", byType: { radhus: "Carport + trädgård", villa: "Garage + trädgård", stuga: "Carport + trädgård" } },
];

export const extraAvailable = (extra: Extra, type: HomeType) => EXTRAS.find((e) => e.id === extra)!.byType[type] !== undefined;

/** kr per m² living area, rough 2026 levels. */
export const AREAS: Record<HomeType, { id: string; label: string; perM2: number }[]> = {
  lagenhet: [
    { id: "vasastan", label: "Vasastan", perM2: 105_000 },
    { id: "sodermalm", label: "Södermalm", perM2: 100_000 },
    { id: "kungsholmen", label: "Kungsholmen", perM2: 98_000 },
    { id: "hammarby", label: "Hammarby Sjöstad", perM2: 82_000 },
    { id: "goteborg", label: "Göteborg", perM2: 62_000 },
    { id: "uppsala", label: "Uppsala", perM2: 48_000 },
  ],
  radhus: [
    { id: "bromma", label: "Bromma", perM2: 62_000 },
    { id: "nacka", label: "Nacka", perM2: 55_000 },
    { id: "taby", label: "Täby", perM2: 52_000 },
    { id: "askim", label: "Askim, Göteborg", perM2: 45_000 },
    { id: "uppsala", label: "Uppsala", perM2: 40_000 },
    { id: "vasteras", label: "Västerås", perM2: 34_000 },
  ],
  villa: [
    { id: "djursholm", label: "Djursholm", perM2: 95_000 },
    { id: "bromma", label: "Bromma", perM2: 70_000 },
    { id: "nacka", label: "Nacka", perM2: 60_000 },
    { id: "taby", label: "Täby", perM2: 58_000 },
    { id: "uppsala", label: "Uppsala", perM2: 42_000 },
    { id: "vasteras", label: "Västerås", perM2: 33_000 },
  ],
  stuga: [
    { id: "vardo", label: "Värmdö", perM2: 55_000 },
    { id: "are", label: "Åre", perM2: 60_000 },
    { id: "vastkusten", label: "Västkusten", perM2: 50_000 },
    { id: "osterlen", label: "Österlen", perM2: 40_000 },
    { id: "gotland", label: "Gotland", perM2: 38_000 },
    { id: "dalarna", label: "Dalarna", perM2: 22_000 },
  ],
};

export const EXTRA_PRICE: Record<Extra, Partial<Record<HomeType, number>>> = {
  balkong: { lagenhet: 180_000, radhus: 90_000, villa: 120_000, stuga: 60_000 },
  pool: { lagenhet: 250_000, radhus: 350_000, villa: 450_000, stuga: 70_000 },
  bastu: { lagenhet: 110_000, radhus: 120_000, villa: 140_000, stuga: 90_000 },
  tradgard: { radhus: 250_000, villa: 380_000, stuga: 120_000 },
};

/** Default living area (m²) by type and number of rooms. */
export const SIZE: Record<HomeType, number[]> = {
  lagenhet: [34, 56, 76, 96, 116],
  radhus: [58, 74, 94, 114, 132],
  villa: [70, 92, 118, 142, 168],
  stuga: [32, 46, 62, 78, 94],
};

export interface Palette {
  wall: string;
  wallTop: string;
  floor: string;
  tile: string;
  accent: string;
  accent2: string;
  textile: string;
  wood: string;
  dark: string;
  metal: string;
  rug: string;
  plant: string;
  cabinet: string;
  counter: string;
  light: string;
}

export const PALETTE: Record<Vibe, Palette> = {
  ungdom: { wall: "#f5f3ef", wallTop: "#2b2d42", floor: "#d9c3a1", tile: "#cfe7ea", accent: "#2ec4b6", accent2: "#ff6b9a", textile: "#ffd23f", wood: "#d4b48c", dark: "#2b2d42", metal: "#9aa3ad", rug: "#7b5ea7", plant: "#4caf50", cabinet: "#f4f4f2", counter: "#d9d4cc", light: "#ffe3a3" },
  skandi: { wall: "#f7f5f0", wallTop: "#3a3f47", floor: "#d8bf98", tile: "#e9e6df", accent: "#b9c2c9", accent2: "#7d9a78", textile: "#e8e2d6", wood: "#c9a77c", dark: "#4a4f57", metal: "#b8b2a7", rug: "#ece6da", plant: "#5f8f5a", cabinet: "#c9a77c", counter: "#eeebe5", light: "#f3e3c3" },
  lyx: { wall: "#ece7df", wallTop: "#1d2a24", floor: "#6b4a33", tile: "#e8e4dc", accent: "#2f5d50", accent2: "#c9a24b", textile: "#3c4a63", wood: "#5c3b26", dark: "#1d1f22", metal: "#c9a24b", rug: "#8a7660", plant: "#3f7d4f", cabinet: "#22302a", counter: "#efece6", light: "#f5d58c" },
  familj: { wall: "#f8f2e6", wallTop: "#34495e", floor: "#d6b88f", tile: "#dcebf2", accent: "#e07a5f", accent2: "#3d85c6", textile: "#f2cc8f", wood: "#c49a6c", dark: "#3d405b", metal: "#a8adb3", rug: "#81b29a", plant: "#5b9b5b", cabinet: "#f6f3ee", counter: "#c49a6c", light: "#f3e3c3" },
};

type Row = [name: string, size: string, price: number, store: string];
const c = (rows: Record<Vibe, Row>): Record<Vibe, CatalogEntry> =>
  Object.fromEntries(Object.entries(rows).map(([v, [name, size, price, store]]) => [v, { name, size, price, store }])) as Record<Vibe, CatalogEntry>;

/** Approximate prices with example stores – shown as "cirkapris". */
export const CATALOG = {
  sofa: c({
    ungdom: ["Bäddsoffa, turkos", "200 × 90 × 80 cm", 3_495, "IKEA"],
    skandi: ["3-sitssoffa, ljusgrå", "220 × 95 × 82 cm", 9_995, "Mio"],
    lyx: ["Sammetssoffa, flaskgrön", "260 × 100 × 78 cm", 42_900, "Svenssons i Lammhult"],
    familj: ["Hörnsoffa, tålig tyg", "280 × 180 × 85 cm", 16_995, "Mio"],
  }),
  armchair: c({
    ungdom: ["Sittsäck XL", "110 × 90 × 70 cm", 899, "Jysk"],
    skandi: ["Fåtölj i ek och ull", "75 × 80 × 78 cm", 5_495, "IKEA"],
    lyx: ["Loungefåtölj i läder", "85 × 85 × 82 cm", 28_500, "Nordiska Galleriet"],
    familj: ["Fåtölj med fotpall", "80 × 85 × 90 cm", 4_995, "Jysk"],
  }),
  coffeeTable: c({
    ungdom: ["Soffbord, vitt", "90 × 55 × 45 cm", 499, "IKEA"],
    skandi: ["Soffbord i ek", "120 × 60 × 40 cm", 3_995, "Mio"],
    lyx: ["Soffbord i marmor", "130 × 70 × 35 cm", 18_900, "NK Inredning"],
    familj: ["Soffbord med förvaring", "110 × 60 × 45 cm", 2_495, "Jysk"],
  }),
  tv: c({
    ungdom: ["TV 55\" + TV-bänk", "160 × 40 × 50 cm", 6_490, "Elgiganten"],
    skandi: ["TV 55\" + TV-bänk i ek", "180 × 40 × 50 cm", 11_990, "Elgiganten / IKEA"],
    lyx: ["OLED-TV 77\" + mediabänk", "220 × 45 × 55 cm", 44_990, "Elgiganten"],
    familj: ["TV 65\" + TV-bänk", "200 × 42 × 50 cm", 12_990, "Elgiganten"],
  }),
  rug: c({
    ungdom: ["Matta, lila shaggy", "200 × 140 cm", 699, "Jysk"],
    skandi: ["Ullmatta, naturvit", "240 × 170 cm", 3_995, "Hemtex"],
    lyx: ["Handknuten matta", "300 × 200 cm", 24_000, "NK Inredning"],
    familj: ["Lekmatta, tvättbar", "200 × 150 cm", 1_295, "IKEA"],
  }),
  dining: c({
    ungdom: ["Klaffbord + 2 stolar (begagnat)", "80 × 80 × 75 cm", 600, "Blocket"],
    skandi: ["Matbord i ek + 4 stolar", "180 × 90 × 75 cm", 12_995, "Mio"],
    lyx: ["Matbord i valnöt + 6 stolar", "240 × 100 × 75 cm", 64_000, "Svenssons i Lammhult"],
    familj: ["Utdragbart matbord + 6 stolar", "200 × 95 × 75 cm", 9_995, "Jysk"],
  }),
  bedDouble: c({
    ungdom: ["Säng 140 cm med madrass", "140 × 200 cm", 3_990, "IKEA"],
    skandi: ["Kontinentalsäng 160 cm", "160 × 200 cm", 14_995, "Jysk"],
    lyx: ["Kontinentalsäng 180 cm, sammet", "180 × 210 cm", 59_900, "NK Inredning"],
    familj: ["Ramsäng 180 cm", "180 × 200 cm", 11_995, "Mio"],
  }),
  bedSingle: c({
    ungdom: ["Loftsäng med skrivbord", "90 × 200 cm", 2_995, "IKEA"],
    skandi: ["Säng 90 cm i ek", "90 × 200 cm", 4_495, "Mio"],
    lyx: ["Gästsäng 120 cm", "120 × 200 cm", 18_900, "Svenssons i Lammhult"],
    familj: ["Barnsäng med förvaring", "90 × 200 cm", 2_495, "IKEA"],
  }),
  nightstand: c({
    ungdom: ["Sängbord + lampa", "40 × 35 × 50 cm", 349, "IKEA"],
    skandi: ["Sängbord i ek + lampa", "45 × 35 × 50 cm", 1_995, "Mio"],
    lyx: ["Sängbord i mässing + lampa", "50 × 40 × 55 cm", 9_800, "Nordiska Galleriet"],
    familj: ["Sängbord + läslampa", "45 × 35 × 50 cm", 899, "Jysk"],
  }),
  wardrobe: c({
    ungdom: ["Klädställning + lådor", "120 × 50 × 180 cm", 899, "IKEA"],
    skandi: ["Garderob, vit", "150 × 60 × 200 cm", 4_995, "IKEA"],
    lyx: ["Platsbyggd garderob", "200 × 60 × 240 cm", 38_000, "Vedum"],
    familj: ["Garderob med skjutdörrar", "200 × 60 × 220 cm", 6_995, "IKEA"],
  }),
  desk: c({
    ungdom: ["Gamingdesk + 2 skärmar + stol", "140 × 70 × 75 cm", 9_990, "Webhallen"],
    skandi: ["Skrivbord i ek + stol", "120 × 60 × 75 cm", 4_495, "IKEA"],
    lyx: ["Skrivbord i valnöt + läderstol", "160 × 80 × 75 cm", 32_000, "Nordiska Galleriet"],
    familj: ["Läxbord + stol", "100 × 60 × 75 cm", 1_995, "IKEA"],
  }),
  bookshelf: c({
    ungdom: ["Bokhylla med LED-list", "80 × 30 × 180 cm", 799, "IKEA / Clas Ohlson"],
    skandi: ["Bokhylla i ek", "90 × 35 × 200 cm", 2_995, "Mio"],
    lyx: ["Vägghylla i mässing", "120 × 35 × 220 cm", 16_500, "NK Inredning"],
    familj: ["Förvaringshylla med lådor", "110 × 40 × 110 cm", 1_495, "IKEA"],
  }),
  toys: c({
    ungdom: ["Spelkonsol + gamingstol", "–", 6_990, "Webhallen"],
    skandi: ["Leksakskista", "70 × 40 × 45 cm", 1_295, "IKEA"],
    lyx: ["Lekhus i trä", "120 × 90 × 130 cm", 7_900, "Brio / NK"],
    familj: ["Leksakskista + lekmatta", "70 × 40 × 45 cm", 999, "BR Leksaker"],
  }),
  plant: c({
    ungdom: ["Monstera i kruka", "Ø 40 × 90 cm", 299, "Plantagen"],
    skandi: ["Fikus i lerkruka", "Ø 45 × 140 cm", 699, "Plantagen"],
    lyx: ["Olivträd i stenkruka", "Ø 55 × 170 cm", 3_995, "Plantagen"],
    familj: ["Gullranka i kruka", "Ø 35 × 60 cm", 199, "Plantagen"],
  }),
  lamp: c({
    ungdom: ["LED-golvlampa RGB", "Ø 30 × 150 cm", 499, "Clas Ohlson"],
    skandi: ["Golvlampa i linne", "Ø 40 × 155 cm", 1_495, "IKEA"],
    lyx: ["Golvlampa i mässing", "Ø 45 × 175 cm", 14_900, "Nordiska Galleriet"],
    familj: ["Läslampa", "Ø 30 × 150 cm", 799, "Jysk"],
  }),
  kitchen: c({
    ungdom: ["Kök: kylskåp, spis, bänk (befintligt)", "–", 0, "Ingår"],
    skandi: ["Kök i ek med vitvaror", "–", 85_000, "IKEA / Marbodal"],
    lyx: ["Platsbyggt kök, sten + Gaggenau", "–", 420_000, "Kvik / Ballingslöv"],
    familj: ["Kök med diskmaskin och stor kyl", "–", 110_000, "Marbodal"],
  }),
  island: c({
    ungdom: ["Köksvagn", "60 × 40 × 85 cm", 599, "IKEA"],
    skandi: ["Köksö i ek", "160 × 80 × 90 cm", 9_995, "IKEA"],
    lyx: ["Köksö i marmor + vinkyl", "240 × 100 × 92 cm", 89_000, "Ballingslöv"],
    familj: ["Köksö med barstolar", "180 × 90 × 90 cm", 12_995, "IKEA"],
  }),
  bath: c({
    ungdom: ["Dusch + toalett (befintligt)", "–", 0, "Ingår"],
    skandi: ["Badrum: dusch, kommod, spegel", "–", 18_000, "Bauhaus"],
    lyx: ["Badkar, marmorkommod, guldarmatur", "–", 145_000, "Svedbergs / Granit"],
    familj: ["Badkar + dubbel tvättställ", "–", 24_000, "Bauhaus"],
  }),
  washer: c({
    ungdom: ["Tvättmaskin (begagnad)", "60 × 60 × 85 cm", 1_500, "Blocket"],
    skandi: ["Tvättmaskin + torktumlare", "60 × 60 × 170 cm", 13_990, "Elgiganten"],
    lyx: ["Tvätt- och torkpelare", "60 × 65 × 170 cm", 27_990, "Elgiganten"],
    familj: ["Tvättmaskin + torktumlare", "60 × 60 × 170 cm", 13_990, "Elgiganten"],
  }),
  sauna: c({
    ungdom: ["Bastuaggregat + lavar", "–", 9_995, "Jula"],
    skandi: ["Bastu i asp, elaggregat", "–", 24_995, "Bauhaus"],
    lyx: ["Bastu med glasvägg + Tylö", "–", 89_000, "Tylö / Granit"],
    familj: ["Bastu med familjelavar", "–", 22_995, "Jula"],
  }),
  loungers: c({
    ungdom: ["2 solstolar", "190 × 60 cm", 798, "Rusta"],
    skandi: ["2 solsängar i teak", "200 × 70 cm", 5_990, "Mio"],
    lyx: ["2 solsängar med dynor", "210 × 80 cm", 24_000, "Royal Botania"],
    familj: ["2 solsängar", "195 × 65 cm", 2_990, "Jysk"],
  }),
  outdoorSofa: c({
    ungdom: ["Pallsoffa + dynor", "160 × 80 cm", 1_200, "Byggmax / Jysk"],
    skandi: ["Utesoffa i trä + bord", "180 × 85 cm", 7_995, "Jysk"],
    lyx: ["Loungegrupp i teak + gasolgrill", "260 × 220 cm", 46_000, "Weber / NK"],
    familj: ["Utemöbelgrupp + grill", "220 × 90 cm", 9_995, "Rusta / Weber"],
  }),
  trampoline: c({
    ungdom: ["Hängmatta", "–", 499, "Rusta"],
    skandi: ["Odlingslådor", "120 × 80 cm", 1_495, "Plantagen"],
    lyx: ["Utekök i rostfritt", "200 × 60 cm", 38_000, "Weber"],
    familj: ["Studsmatta Ø 3,6 m", "Ø 366 cm", 3_995, "Biltema"],
  }),
};

export type CatalogKind = keyof typeof CATALOG;
