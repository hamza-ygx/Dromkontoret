import { STANDARD_LABEL, TRIP_STYLES, budgetById, destById } from "./catalog";
import { ACTIVITY_PER_DAY, DEST_RATES, EXTRA, JET, KID, PARTY, STANDARD_FACTOR, ULTRA } from "./rates";
import type { CostLine, Standard, Trip, TripConfig, TripPlan } from "./types";

const STANDARDS: Standard[] = ["budget", "mellan", "lyx", "ultra", "jet"];
const round = (v: number) => Math.round(v / 100) * 100;
const n = (v: number) => Math.round(v).toLocaleString("sv-SE");

export const partyText = (cfg: TripConfig) => {
  const p = PARTY[cfg.party];
  return `${p.adults} ${p.adults === 1 ? "vuxen" : "vuxna"}${p.kids ? ` + ${p.kids} barn` : ""}`;
};

export const spotRates = (cfg: TripConfig) => DEST_RATES[cfg.dest][TRIP_STYLES.find((t) => t.id === cfg.style)!.beach ? "beach" : "city"];

export function tripCost(cfg: TripConfig, s: Standard): Trip {
  const r = spotRates(cfg);
  const index = Math.max(EXTRA.indexFloor, r.index);
  const p = PARTY[cfg.party];
  const nights = cfg.nights;
  const has = (a: TripConfig["addons"][number]) => cfg.addons.includes(a);
  const allInc = has("allinc") && r.allInclusive !== null;
  const eaters = p.adults + p.kids * KID.food;
  const doers = p.adults + p.kids * KID.activities;

  const jet = s === "jet";
  const ultra = s === "ultra" || jet;
  const base = ultra ? "lyx" : (s as "budget" | "mellan" | "lyx");
  const perAdult = r.flight[base] * (ultra ? ULTRA.flight : 1);
  const hours = JET.hours[cfg.dest];
  const jetCost = 2 * hours * JET.eurPerHour.find(([h]) => hours <= h)![1] * (1 + JET.fees) * JET.sekPerEur;
  const flight = round(jet ? jetCost : perAdult * (p.adults + p.kids * KID.flight));
  const night = round(r.night[base] * (ultra ? ULTRA.night : 1) * p.room);
  const stay = night * nights;
  const foodDay = r.food * STANDARD_FACTOR[s].food * eaters;
  const food = round(allInc ? foodDay * nights * EXTRA.allInclusiveFoodLeft + r.allInclusive! * (p.adults + p.kids * EXTRA.allInclusiveKid) * nights * (s === "lyx" ? 1.5 : ultra ? ULTRA.allInclusive : 1) : foodDay * nights);
  const trips = has("utflykt") ? Math.ceil(nights / EXTRA.excursionEveryNights) : 0;
  const fun = round(ACTIVITY_PER_DAY[cfg.style] * index * STANDARD_FACTOR[s].activities * doers * nights + trips * EXTRA.excursion * index * doers);
  const moving = round((has("bil") ? (r.car + EXTRA.fuelPerDay) * nights : EXTRA.transportPerDay * index * nights * (p.adults + p.kids > 2 ? 1.5 : 1)) * (ultra ? ULTRA.transport : 1));
  const cover = has("skydd") ? round((flight + stay) * EXTRA.cancellationShare) : 0;

  const lines: CostLine[] = [
    {
      id: "flyg",
      label: jet ? "Privatjet tur och retur" : cfg.dest === "sverige" ? "Resa dit och hem" : "Flyg tur och retur",
      detail: jet ? `Hela planet, ca ${String(hours).replace(".", ",")} h per väg` : `${partyText(cfg)}, ${ultra ? "first/business, " : ""}ca ${n(perAdult)} kr per vuxen`,
      amount: flight,
    },
    { id: "boende", label: "Boende", detail: `${nights} nätter × ${n(night)} kr`, amount: stay },
    { id: "mat", label: allInc ? "Allt inkluderat" : "Mat och dryck", detail: allInc ? "Mat och dryck på hotellet, plus lite extra" : `ca ${n(foodDay / Math.max(1, eaters))} kr per vuxen och dag`, amount: food },
    { id: "aktiviteter", label: "Aktiviteter", detail: trips ? `${TRIP_STYLES.find((t) => t.id === cfg.style)!.label.toLowerCase()} + ${trips} guidade utflykter` : TRIP_STYLES.find((t) => t.id === cfg.style)!.hint.toLowerCase(), amount: fun },
    { id: "transport", label: ultra ? "Privatchaufför" : has("bil") ? "Hyrbil" : "Transport på plats", detail: ultra ? "Privata transfers och chaufför hela vistelsen" : has("bil") ? `${nights} dagar inkl. bensin` : "Transfer, taxi och kollektivtrafik", amount: moving },
  ];
  if (cover) lines.push({ id: "skydd", label: "Avbeställningsskydd", detail: `${Math.round(EXTRA.cancellationShare * 100)} % av resa och boende`, amount: cover });
  const total = lines.reduce((a, l) => a + l.amount, 0);
  return { standard: s, lines, total, fits: total <= budgetById(cfg.budget).max };
}

export function planTrip(cfg: TripConfig, pick?: Standard): TripPlan {
  const options = STANDARDS.map((s) => tripCost(cfg, s));
  const best = [...options].reverse().find((t) => t.fits) ?? options[0];
  const trip = pick ? options.find((t) => t.standard === pick)! : best;
  const d = destById(cfg.dest);
  const beach = TRIP_STYLES.find((t) => t.id === cfg.style)!.beach;
  const spot = beach ? d.beach : d.city;
  const big = cfg.party === "2+2" || cfg.party === "4";
  const accom = trip.standard === "budget" ? (big ? "Enkel lägenhet" : "Studio") : trip.standard === "mellan" ? "Lägenhet" : trip.standard === "lyx" ? (beach ? "Villa med pool" : "Takvåning") : beach ? "Privat villa med personal" : "Penthouse-svit";
  return { config: cfg, trip, options, place: spot.name, title: `${accom} ${spot.prep} ${spot.name}`, beach };
}

export const bestStandard = (cfg: TripConfig) => {
  const options = STANDARDS.map((s) => tripCost(cfg, s));
  return ([...options].reverse().find((t) => t.fits) ?? options[0]).standard;
};

export const standardLabel = (s: Standard) => STANDARD_LABEL[s];
