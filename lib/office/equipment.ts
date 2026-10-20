import type { CatalogEntry } from "../home/types";
import type { Style } from "./types";

type Row = [name: string, size: string, price: number, store: string];
const STYLES: Style[] = ["startup", "skandi", "exklusiv", "kreativt"];
const entry = ([name, size, price, store]: Row): CatalogEntry => ({ name, size, price, store });
const per = (rows: Record<Style, Row>) => Object.fromEntries(STYLES.map((s) => [s, entry(rows[s])])) as Record<Style, CatalogEntry>;
const all = (row: Row) => per({ startup: row, skandi: row, exklusiv: row, kreativt: row });

export const EQUIP = {
  desk: per({
    startup: ["Arbetsplats: höj- och sänkbart bord, stol, skärm", "160 × 80 cm", 9_900, "IKEA Business / Elgiganten"],
    skandi: ["Arbetsplats: höj- och sänkbart bord i ek, ergonomisk stol, skärm", "160 × 80 cm", 18_500, "Input Interiör"],
    exklusiv: ["Arbetsplats: valnötsbord, läderstol, två skärmar", "180 × 80 cm", 34_000, "Kinnarps"],
    kreativt: ["Arbetsplats: bord på bockben, sadelstol, skärm", "160 × 80 cm", 14_900, "Input Interiör"],
  }),
  reception: per({
    startup: ["Receptionsdisk", "200 × 60 × 105 cm", 6_500, "IKEA Business"],
    skandi: ["Receptionsdisk i ek", "220 × 70 × 105 cm", 24_000, "Input Interiör"],
    exklusiv: ["Receptionsdisk i valnöt och sten", "260 × 70 × 105 cm", 58_000, "Kinnarps"],
    kreativt: ["Receptionsdisk av återbrukat trä", "220 × 70 × 105 cm", 18_000, "Input Interiör"],
  }),
  waiting: per({
    startup: ["Soffa i entrén", "180 × 85 cm", 4_995, "IKEA Business"],
    skandi: ["Soffa i ull, entré", "200 × 85 cm", 16_500, "Input Interiör"],
    exklusiv: ["Lädersoffa, entré", "220 × 90 cm", 46_000, "Kinnarps"],
    kreativt: ["Vintagesoffa, entré", "200 × 85 cm", 9_000, "Blocket"],
  }),
  meeting: per({
    startup: ["Mötesbord + 6 stolar", "180 × 90 cm", 11_500, "IKEA Business"],
    skandi: ["Mötesbord i ek + 6 stolar", "200 × 100 cm", 28_000, "Input Interiör"],
    exklusiv: ["Mötesbord i valnöt + 6 läderstolar", "220 × 100 cm", 68_000, "Kinnarps"],
    kreativt: ["Mötesbord i betong + 6 olika stolar", "200 × 100 cm", 21_000, "Input Interiör"],
  }),
  screen: per({
    startup: ["Skärm 65\" med webbkamera", "145 × 83 cm", 12_990, "Elgiganten"],
    skandi: ["Skärm 75\" med videomöteskit", "168 × 96 cm", 24_990, "Elgiganten"],
    exklusiv: ["Skärm 86\" med videomöteskit", "193 × 110 cm", 64_990, "Elgiganten"],
    kreativt: ["Skärm 65\" + projektor", "145 × 83 cm", 18_990, "Elgiganten"],
  }),
  conference: per({
    startup: ["Konferensbord + 10 stolar", "360 × 110 cm", 24_000, "IKEA Business"],
    skandi: ["Konferensbord i ek + 10 stolar", "380 × 120 cm", 62_000, "Input Interiör"],
    exklusiv: ["Konferensbord i valnöt + 10 läderstolar", "400 × 120 cm", 145_000, "Kinnarps"],
    kreativt: ["Långbord i massivträ + 10 stolar", "380 × 110 cm", 42_000, "Input Interiör"],
  }),
  pentry: per({
    startup: ["Pentry: kyl, diskmaskin, mikro, kaffebryggare", "–", 42_000, "IKEA Business / Elgiganten"],
    skandi: ["Pentry i ek: vitvaror och bönmaskin", "–", 88_000, "Ballingslöv / Elgiganten"],
    exklusiv: ["Pentry i sten: integrerade vitvaror, espressomaskin", "–", 165_000, "Kvik / Elgiganten"],
    kreativt: ["Pentry i stål: vitvaror och espressomaskin", "–", 72_000, "IKEA Business / Elgiganten"],
  }),
  fika: per({
    startup: ["Fikabord + 4 stolar", "120 × 75 cm", 3_995, "IKEA Business"],
    skandi: ["Fikabord i ek + 4 stolar", "140 × 80 cm", 14_500, "Input Interiör"],
    exklusiv: ["Fikabord i marmor + 4 stolar", "140 × 80 cm", 36_000, "Kinnarps"],
    kreativt: ["Fikabord + 4 omaka stolar", "140 × 80 cm", 8_500, "Blocket"],
  }),
  lounge: per({
    startup: ["Loungesoffa + sittsäckar", "220 × 90 cm", 11_000, "IKEA Business"],
    skandi: ["Loungesoffa + fåtölj", "240 × 95 cm", 36_000, "Input Interiör"],
    exklusiv: ["Loungegrupp i läder", "260 × 100 cm", 92_000, "Kinnarps"],
    kreativt: ["Modulsoffa + vintagefåtölj", "240 × 95 cm", 26_000, "Input Interiör"],
  }),
  fun: per({
    startup: ["Pingisbord", "274 × 153 cm", 6_495, "Stiga / Intersport"],
    skandi: ["Läshörna: bokhylla och fåtölj", "200 × 90 cm", 12_000, "Input Interiör"],
    exklusiv: ["Biljardbord", "250 × 140 cm", 48_000, "Biljardshopen"],
    kreativt: ["Arkadmaskin", "70 × 80 × 175 cm", 14_990, "Webhallen"],
  }),
  storage: per({
    startup: ["Förvaringsskåp", "160 × 45 × 120 cm", 2_495, "IKEA Business"],
    skandi: ["Förvaringsskåp i ek", "180 × 45 × 120 cm", 9_500, "Input Interiör"],
    exklusiv: ["Arkivskåp i valnöt", "200 × 45 × 120 cm", 22_000, "Kinnarps"],
    kreativt: ["Plåtskåp, industri", "180 × 45 × 120 cm", 6_500, "Clas Ohlson"],
  }),
  printer: all(["Multifunktionsskrivare", "60 × 60 × 110 cm", 16_990, "Dustin"]),
  plant: per({
    startup: ["Monstera i kruka", "Ø 45 × 120 cm", 399, "Plantagen"],
    skandi: ["Fikus i lerkruka", "Ø 45 × 150 cm", 899, "Plantagen"],
    exklusiv: ["Olivträd i stenkruka", "Ø 55 × 170 cm", 3_995, "Plantagen"],
    kreativt: ["Kaktus i betongkruka", "Ø 40 × 140 cm", 1_195, "Plantagen"],
  }),
  wc: all(["WC och tvättställ", "–", 0, "Ingår i lokalen"]),
  treadmill: all(["Löpband", "190 × 80 cm", 24_990, "XXL"]),
  weights: all(["Viktställ, hantlar och bänk", "160 × 120 cm", 14_990, "XXL"]),
  shower: all(["Duschrum med skåp", "–", 38_000, "Bauhaus"]),
  charger: all(["Laddbox 11 kW inkl. installation", "–", 16_000, "Clas Ohlson + elinstallatör"]),
  table4: per({
    startup: ["Cafébord + 4 stolar", "80 × 80 cm", 3_600, "IKEA Business"],
    skandi: ["Bord i ek + 4 stolar", "80 × 80 cm", 13_500, "Input Interiör"],
    exklusiv: ["Bord med linneduk + 4 sammetsstolar", "90 × 90 cm", 32_000, "Kinnarps"],
    kreativt: ["Bistrobord + 4 thonetstolar", "80 × 80 cm", 7_900, "Blocket"],
  }),
  bar: per({
    startup: ["Kaffebar med disk och vitrin", "–", 38_000, "Martin & Servera / lokal snickare"],
    skandi: ["Bardisk i ek", "–", 65_000, "Martin & Servera / lokal snickare"],
    exklusiv: ["Bardisk i marmor och mässing", "–", 160_000, "Martin & Servera / lokal snickare"],
    kreativt: ["Bardisk i betong och tegel", "–", 58_000, "Martin & Servera / lokal snickare"],
  }),
  stools: per({
    startup: ["Barstolar", "Ø 40 × 75 cm", 3_000, "IKEA Business"],
    skandi: ["Barstolar i ek", "Ø 40 × 75 cm", 9_600, "Input Interiör"],
    exklusiv: ["Barstolar i läder", "Ø 42 × 78 cm", 26_000, "Kinnarps"],
    kreativt: ["Barstolar, industri", "Ø 40 × 75 cm", 5_400, "Clas Ohlson"],
  }),
  backbar: all(["Bakbar med flaskkylar", "–", 34_000, "Martin & Servera"]),
  espresso: per({
    startup: ["Espressomaskin, 2 grupper", "–", 39_000, "Martin & Servera"],
    skandi: ["Espressomaskin, 2 grupper", "–", 49_000, "Martin & Servera"],
    exklusiv: ["Espressomaskin, 3 grupper", "–", 89_000, "Martin & Servera"],
    kreativt: ["Espressomaskin, 2 grupper", "–", 49_000, "Martin & Servera"],
  }),
  pos: all(["Kassasystem + kortterminal", "–", 9_500, "Zettle"]),
  combi: all(["Kombiugn 10 × GN 1/1", "85 × 80 × 105 cm", 165_000, "Metos / Rational"]),
  range: all(["Spislinje med induktion, stekbord och imkåpa", "–", 210_000, "Electrolux Professional"]),
  combiSmall: all(["Kombiugn 6 × GN 1/1", "85 × 77 × 80 cm", 95_000, "Metos / Rational"]),
  rangeSmall: all(["Spis med ugn och imkåpa", "–", 65_000, "Electrolux Professional"]),
  dishSmall: all(["Huvdiskmaskin med diskbänk", "–", 55_000, "Metos / Hobart"]),
  freezerCab: all(["Frysskåp, rostfritt", "70 × 80 × 200 cm", 24_000, "Electrolux Professional"]),
  prep: all(["Rostfri arbetsbänk", "–", 9_500, "Martin & Servera"]),
  fridge: all(["Kylskåp, rostfritt", "70 × 80 × 200 cm", 26_000, "Electrolux Professional"]),
  dish: all(["Huvdiskmaskin med diskbänkar", "–", 95_000, "Metos / Hobart"]),
  tableware: all(["Porslin, glas och bestick", "–", 0, "Martin & Servera"]),
  coldroom: all(["Kylrum, prefab", "–", 85_000, "Metos"]),
  freezer: all(["Frysrum, prefab", "–", 95_000, "Metos"]),
  shelving: all(["Förrådshyllor, rostfria", "–", 12_000, "Martin & Servera"]),
  lockers: all(["Klädskåp för personal", "–", 2_400, "Clas Ohlson"]),
  staffTable: all(["Personalbord + stolar", "140 × 80 cm", 5_000, "IKEA Business"]),
  van: per({
    startup: ["Skåpbil, begagnad", "5,3 m", 185_000, "Blocket / bilhandlare"],
    skandi: ["Elskåpbil med verktygsinredning", "5,3 m", 465_000, "Volkswagen / Würth"],
    exklusiv: ["Skåpbil, ny, med dekor och inredning", "5,9 m", 540_000, "Mercedes-Benz / Würth"],
    kreativt: ["Skåpbil, begagnad, med dekor", "5,3 m", 225_000, "Blocket / bilhandlare"],
  }),
  timberRack: all(["Virkesställ, utomhus", "600 × 120 × 250 cm", 18_000, "Ahlsell"]),
  palletRack: all(["Pallställ, 3 sektioner", "810 × 110 × 300 cm", 21_000, "Ahlsell"]),
  saw: all(["Kap- och klyvsåg på stativ", "–", 24_000, "Würth"]),
  workbench: all(["Arbetsbänk med verktygstavla", "200 × 75 cm", 12_500, "Würth"]),
  toolCabinet: all(["Verktygsskåp med sortiment", "120 × 50 × 190 cm", 28_000, "Würth"]),
  powerTools: per({
    startup: ["Elverktyg, grundsats", "–", 25_000, "Clas Ohlson"],
    skandi: ["Elverktyg, batterisystem", "–", 45_000, "Würth"],
    exklusiv: ["Elverktyg, komplett batterisystem", "–", 85_000, "Würth"],
    kreativt: ["Elverktyg, batterisystem", "–", 40_000, "Clas Ohlson"],
  }),
  gondola: per({
    startup: ["Butikshylla, vit", "per sektion 100 cm", 2_400, "IKEA Business"],
    skandi: ["Gondolhylla i ek", "per sektion 100 cm", 6_500, "ITAB"],
    exklusiv: ["Vitrinhylla i glas och mässing", "per sektion 100 cm", 14_000, "ITAB"],
    kreativt: ["Hylla av byggställning och plywood", "per sektion 100 cm", 3_200, "Byggmax"],
  }),
  wallShelf: per({
    startup: ["Väggreol, vit", "per sektion 100 cm", 1_800, "IKEA Business"],
    skandi: ["Väggreol i ek", "per sektion 100 cm", 5_200, "ITAB"],
    exklusiv: ["Väggvitrin med belysning", "per sektion 100 cm", 12_000, "ITAB"],
    kreativt: ["Väggreol av rör och plank", "per sektion 100 cm", 2_600, "Byggmax"],
  }),
  checkout: per({
    startup: ["Kassadisk med kassasystem", "180 × 70 cm", 14_000, "IKEA Business / Zettle"],
    skandi: ["Kassadisk i ek med kassasystem", "180 × 70 cm", 32_000, "ITAB / Extenda Retail"],
    exklusiv: ["Kassadisk i sten med kassasystem", "200 × 70 cm", 68_000, "ITAB / Extenda Retail"],
    kreativt: ["Kassadisk av återbruk med kassasystem", "180 × 70 cm", 21_000, "ITAB / Zettle"],
  }),
  stockShelf: all(["Lagerhylla, 5 plan", "per sektion 100 cm", 2_900, "Ahlsell"]),
  lift: all(["Billyft, 2-pelare 3,5 t", "–", 72_000, "Mekonomen"]),
  tyre: all(["Däckmaskin + balanseringsmaskin", "–", 95_000, "Mekonomen"]),
  compressor: all(["Kompressor med tryckluftsslingor", "–", 32_000, "Würth"]),
  diagnostics: all(["Diagnosverktyg + verktygsvagn", "–", 48_000, "Würth"]),
  chambre: per({
    startup: ["Långbord + 10 stolar", "360 × 100 cm", 18_000, "IKEA Business"],
    skandi: ["Långbord i ek + 10 stolar", "380 × 100 cm", 52_000, "Input Interiör"],
    exklusiv: ["Långbord med duk + 10 sammetsstolar", "400 × 110 cm", 120_000, "Kinnarps"],
    kreativt: ["Långbord i massivträ + 10 stolar", "380 × 100 cm", 36_000, "Blocket"],
  }),
};

export type EquipKind = keyof typeof EQUIP;

export const TABLEWARE_PER_SEAT = 450;
export const LOCKER_PER_STAFF = 1;
