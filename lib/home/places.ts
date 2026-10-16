import type { HomeType } from "./types";

// All 290 kommuner by län, with a rough villa price level in tkr per m² (demo estimates, not statistics).
const RAW: [string, string][] = [
  ["Stockholms län", "Botkyrka:38,Danderyd:85,Ekerö:45,Haninge:38,Huddinge:45,Järfälla:45,Lidingö:75,Nacka:58,Norrtälje:30,Nykvarn:32,Nynäshamn:30,Salem:42,Sigtuna:36,Sollentuna:58,Solna:72,Stockholm:65,Sundbyberg:60,Södertälje:32,Tyresö:48,Täby:60,Upplands Väsby:42,Upplands-Bro:38,Vallentuna:44,Vaxholm:50,Värmdö:46,Österåker:46"],
  ["Uppsala län", "Enköping:28,Heby:17,Håbo:33,Knivsta:38,Tierp:18,Uppsala:40,Älvkarleby:17,Östhammar:20"],
  ["Södermanlands län", "Eskilstuna:26,Flen:15,Gnesta:25,Katrineholm:18,Nyköping:27,Oxelösund:20,Strängnäs:30,Trosa:32,Vingåker:13"],
  ["Östergötlands län", "Boxholm:12,Finspång:16,Kinda:13,Linköping:33,Mjölby:22,Motala:21,Norrköping:28,Söderköping:25,Vadstena:22,Valdemarsvik:14,Ydre:10,Åtvidaberg:14,Ödeshög:11"],
  ["Jönköpings län", "Aneby:12,Eksjö:16,Gislaved:15,Gnosjö:13,Habo:28,Jönköping:32,Mullsjö:18,Nässjö:16,Sävsjö:13,Tranås:18,Vaggeryd:18,Vetlanda:15,Värnamo:20"],
  ["Kronobergs län", "Alvesta:16,Lessebo:12,Ljungby:17,Markaryd:12,Tingsryd:12,Uppvidinge:10,Växjö:30,Älmhult:18"],
  ["Kalmar län", "Borgholm:28,Emmaboda:12,Hultsfred:10,Högsby:9,Kalmar:30,Mönsterås:15,Mörbylånga:26,Nybro:15,Oskarshamn:18,Torsås:13,Vimmerby:14,Västervik:18"],
  ["Gotlands län", "Gotland:26"],
  ["Blekinge län", "Karlshamn:19,Karlskrona:24,Olofström:11,Ronneby:16,Sölvesborg:20"],
  ["Skåne län", "Bjuv:18,Bromölla:15,Burlöv:30,Båstad:34,Eslöv:22,Helsingborg:32,Hässleholm:17,Höganäs:32,Hörby:17,Höör:22,Klippan:16,Kristianstad:22,Kävlinge:32,Landskrona:22,Lomma:46,Lund:40,Malmö:35,Osby:12,Perstorp:13,Simrishamn:24,Sjöbo:18,Skurup:21,Staffanstorp:34,Svalöv:17,Svedala:28,Tomelilla:17,Trelleborg:24,Vellinge:42,Ystad:27,Åstorp:16,Ängelholm:28,Örkelljunga:14,Östra Göinge:12"],
  ["Hallands län", "Falkenberg:26,Halmstad:31,Hylte:13,Kungsbacka:40,Laholm:22,Varberg:33"],
  ["Västra Götalands län", "Ale:33,Alingsås:30,Bengtsfors:9,Bollebygd:28,Borås:26,Dals-Ed:9,Essunga:13,Falköping:15,Färgelanda:10,Grästorp:13,Gullspång:9,Göteborg:45,Götene:15,Herrljunga:14,Hjo:16,Härryda:40,Karlsborg:13,Kungälv:36,Lerum:37,Lidköping:21,Lilla Edet:20,Lysekil:24,Mariestad:17,Mark:22,Mellerud:10,Munkedal:14,Mölndal:42,Orust:26,Partille:40,Skara:15,Skövde:22,Sotenäs:30,Stenungsund:32,Strömstad:30,Svenljunga:13,Tanum:24,Tibro:13,Tidaholm:13,Tjörn:32,Tranemo:13,Trollhättan:22,Töreboda:11,Uddevalla:23,Ulricehamn:19,Vara:14,Vårgårda:18,Vänersborg:20,Åmål:11,Öckerö:40"],
  ["Värmlands län", "Arvika:15,Eda:10,Filipstad:8,Forshaga:15,Grums:11,Hagfors:7,Hammarö:26,Karlstad:27,Kil:16,Kristinehamn:14,Munkfors:8,Storfors:8,Sunne:13,Säffle:11,Torsby:9,Årjäng:11"],
  ["Örebro län", "Askersund:15,Degerfors:10,Hallsberg:14,Hällefors:7,Karlskoga:15,Kumla:20,Laxå:9,Lekeberg:18,Lindesberg:13,Ljusnarsberg:6,Nora:14,Örebro:28"],
  ["Västmanlands län", "Arboga:14,Fagersta:11,Hallstahammar:15,Kungsör:15,Köping:15,Norberg:9,Sala:16,Skinnskatteberg:8,Surahammar:13,Västerås:30"],
  ["Dalarnas län", "Avesta:12,Borlänge:18,Falun:22,Gagnef:16,Hedemora:12,Leksand:20,Ludvika:12,Malung-Sälen:16,Mora:18,Orsa:13,Rättvik:16,Smedjebacken:11,Säter:15,Vansbro:9,Älvdalen:11"],
  ["Gävleborgs län", "Bollnäs:12,Gävle:22,Hofors:9,Hudiksvall:15,Ljusdal:10,Nordanstig:9,Ockelbo:9,Ovanåker:11,Sandviken:15,Söderhamn:11"],
  ["Västernorrlands län", "Härnösand:15,Kramfors:9,Sollefteå:8,Sundsvall:20,Timrå:15,Ånge:7,Örnsköldsvik:17"],
  ["Jämtlands län", "Berg:9,Bräcke:7,Härjedalen:12,Krokom:16,Ragunda:6,Strömsund:7,Åre:32,Östersund:24"],
  ["Västerbottens län", "Bjurholm:8,Dorotea:5,Lycksele:10,Malå:6,Nordmaling:10,Norsjö:6,Robertsfors:10,Skellefteå:20,Sorsele:5,Storuman:9,Umeå:28,Vilhelmina:6,Vindeln:9,Vännäs:14,Åsele:5"],
  ["Norrbottens län", "Arjeplog:7,Arvidsjaur:8,Boden:14,Gällivare:14,Haparanda:9,Jokkmokk:8,Kalix:11,Kiruna:18,Luleå:24,Pajala:6,Piteå:19,Älvsbyn:10,Överkalix:6,Övertorneå:6"],
];

/** Islands and places you live "på" rather than "i". */
const PA = new Set(["Gotland", "Lidingö", "Värmdö", "Ekerö", "Orust", "Tjörn", "Öckerö"]);

export interface Place {
  id: string;
  name: string;
  lan: string;
  villa: number;
  key: string;
}

/** Lowercase and strip å/ä/ö etc so "goteborg" finds Göteborg. */
export const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .trim();

export const PLACES: Place[] = RAW.flatMap(([lan, list]) =>
  list.split(",").map((entry) => {
    const [name, v] = entry.split(":");
    return { id: name.toLowerCase().replace(/ /g, "-"), name, lan, villa: Number(v) * 1000, key: fold(name) };
  }),
);

const BY_ID = new Map(PLACES.map((p) => [p.id, p]));
export const placeById = (id: string) => BY_ID.get(id) ?? BY_ID.get("stockholm")!;
export const preposition = (p: Place) => (PA.has(p.name) ? "på" : "i");

/** kr per m² for a home type in a kommun. */
export function perM2(type: HomeType, p: Place) {
  const v = p.villa;
  const k = v / 1000;
  const raw =
    type === "lagenhet" ? Math.min(k * 1.45, 40 + k * 0.85) * 1000 : type === "radhus" ? v * 0.9 : type === "stuga" ? v * 0.85 : v;
  return Math.round(raw / 500) * 500;
}

const POPULAR = ["stockholm", "göteborg", "malmö", "uppsala", "linköping", "örebro", "västerås", "helsingborg"];

/** Prefix matches first, then word starts, then anywhere; län names also match. */
export function searchPlaces(q: string, limit = 8): Place[] {
  const f = fold(q);
  if (!f) return POPULAR.map((id) => BY_ID.get(id)!);
  const score = (p: Place) => {
    if (p.key.startsWith(f)) return 0;
    if (p.key.split(" ").some((w) => w.startsWith(f))) return 1;
    if (p.key.includes(f)) return 2;
    if (f.length >= 3 && fold(p.lan).startsWith(f)) return 3;
    return 9;
  };
  return PLACES.map((p) => [score(p), p] as const)
    .filter(([s]) => s < 9)
    .sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name, "sv"))
    .slice(0, limit)
    .map(([, p]) => p);
}
