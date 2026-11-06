import { generate } from "../home/layout";
import type { Config } from "../home/types";
import { STANDARD_LABEL, TRIP_STYLES, destById } from "./catalog";
import { ACTIVITY_PER_DAY, DEST_RATES, EXTRA, KID, PARTY, STANDARD_FACTOR } from "./rates";
import { toStay } from "./stay";
import type { CostLine, Standard, Trip, TripConfig, TripPlan } from "./types";

const STANDARDS: Standard[] = ["budget", "mellan", "lyx"];
const round = (v: number) => Math.round(v / 100) * 100;
const n = (v: number) => Math.round(v).toLocaleString("sv-SE");

export const partyText = (cfg: TripConfig) => {
  const p = PARTY[cfg.party];
  return `${p.adults} ${p.adults === 1 ? "vuxen" : "vuxna"}${p.kids ? ` + ${p.kids} barn` : ""}`;
};

export function tripCost(cfg: TripConfig, s: Standard): Trip {
  const r = DEST_RATES[cfg.dest];
  const p = PARTY[cfg.party];
  const nights = cfg.nights;
  const has = (a: TripConfig["addons"][number]) => cfg.addons.includes(a);
  const allInc = has("allinc") && r.allInclusive !== null;
  const eaters = p.adults + p.kids * KID.food;
  const doers = p.adults + p.kids * KID.activities;

  const flight = round(r.flight[s] * (p.adults + p.kids * KID.flight));
  const night = round(r.night[s] * p.room);
  const stay = night * nights;
  const foodDay = r.food * STANDARD_FACTOR[s].food * eaters;
  const food = round(allInc ? foodDay * nights * EXTRA.allInclusiveFoodLeft + r.allInclusive! * (p.adults + p.kids * EXTRA.allInclusiveKid) * nights * (s === "lyx" ? 1.5 : 1) : foodDay * nights);
  const trips = has("utflykt") ? Math.ceil(nights / EXTRA.excursionEveryNights) : 0;
  const fun = round(ACTIVITY_PER_DAY[cfg.style] * r.index * STANDARD_FACTOR[s].activities * doers * nights + trips * EXTRA.excursion * r.index * doers);
  const moving = round(has("bil") ? (r.car + EXTRA.fuelPerDay) * nights : EXTRA.transportPerDay * r.index * nights * (p.adults + p.kids > 2 ? 1.5 : 1));
  const cover = has("skydd") ? round((flight + stay) * EXTRA.cancellationShare) : 0;

  const lines: CostLine[] = [
    { id: "flyg", label: cfg.dest === "sverige" ? "Resa dit och hem" : "Flyg tur och retur", detail: `${partyText(cfg)}, ca ${n(r.flight[s])} kr per vuxen`, amount: flight },
    { id: "boende", label: "Boende", detail: `${nights} nätter × ${n(night)} kr`, amount: stay },
    { id: "mat", label: allInc ? "Allt inkluderat" : "Mat och dryck", detail: allInc ? "Mat och dryck på hotellet, plus lite extra" : `ca ${n(foodDay / Math.max(1, eaters))} kr per vuxen och dag`, amount: food },
    { id: "aktiviteter", label: "Aktiviteter", detail: trips ? `${TRIP_STYLES.find((t) => t.id === cfg.style)!.label.toLowerCase()} + ${trips} guidade utflykter` : TRIP_STYLES.find((t) => t.id === cfg.style)!.hint.toLowerCase(), amount: fun },
    { id: "transport", label: has("bil") ? "Hyrbil" : "Transport på plats", detail: has("bil") ? `${nights} dagar inkl. bensin` : "Transfer, taxi och kollektivtrafik", amount: moving },
  ];
  if (cover) lines.push({ id: "skydd", label: "Avbeställningsskydd", detail: `${Math.round(EXTRA.cancellationShare * 100)} % av resa och boende`, amount: cover });
  const total = lines.reduce((a, l) => a + l.amount, 0);
  return { standard: s, lines, total, fits: total <= cfg.budget };
}

function homeConfig(cfg: TripConfig, s: Standard, beach: boolean): Config {
  const kids = PARTY[cfg.party].kids > 0;
  const big = cfg.party === "2+2" || cfg.party === "4";
  if (s === "budget") return { type: "lagenhet", rooms: big ? 2 : 1, vibe: "ungdom", area: "stockholm", extras: ["balkong"] };
  if (s === "mellan") return { type: "lagenhet", rooms: big ? 3 : 2, vibe: kids ? "familj" : "skandi", area: "stockholm", extras: ["balkong"] };
  return { type: beach ? "villa" : "lagenhet", rooms: big ? 4 : 3, vibe: kids ? "familj" : "lyx", area: "stockholm", extras: ["balkong", "pool"] };
}


export function planTrip(cfg: TripConfig, pick?: Standard): TripPlan {
  const options = STANDARDS.map((s) => tripCost(cfg, s));
  const best = [...options].reverse().find((t) => t.fits) ?? options[0];
  const trip = pick ? options.find((t) => t.standard === pick)! : best;
  const d = destById(cfg.dest);
  const beach = TRIP_STYLES.find((t) => t.id === cfg.style)!.beach;
  const spot = beach ? d.beach : d.city;
  const hc = homeConfig(cfg, trip.standard, beach);
  const home = toStay(generate(hc), beach);
  const accom = trip.standard === "budget" ? (hc.rooms === 1 ? "Studio" : "Enkel lägenhet") : trip.standard === "mellan" ? "Lägenhet" : beach ? "Villa med pool" : "Takvåning";
  return { config: cfg, trip, options, place: spot.name, title: `${accom} ${spot.prep} ${spot.name}`, home, beach };
}

export const bestStandard = (cfg: TripConfig) => {
  const options = STANDARDS.map((s) => tripCost(cfg, s));
  return ([...options].reverse().find((t) => t.fits) ?? options[0]).standard;
};

export const standardLabel = (s: Standard) => STANDARD_LABEL[s];
