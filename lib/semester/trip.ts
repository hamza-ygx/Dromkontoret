import { DESTS, STANDARD_LABEL, budgetById, destById, styleById } from "./catalog";
import { ACTIVITY_PER_DAY, DEPARTURE, DEST_RATES, EXTRA, JET, KID, LIFT_PASS, ROOM, SAFARI, SKI_RENTAL, STANDARD_FACTOR, ULTRA } from "./rates";
import { SPOTS } from "./spots";
import type { CostLine, DestId, Slot, Standard, Trip, TripConfig, TripPlan, TripStyle } from "./types";

const STANDARDS: Standard[] = ["budget", "mellan", "lyx", "ultra", "jet"];
const round = (v: number) => Math.round(v / 100) * 100;
const n = (v: number) => Math.round(v).toLocaleString("sv-SE");

export const people = (cfg: TripConfig) => cfg.adults + cfg.kids;

export const partyText = (cfg: TripConfig) => `${cfg.adults} ${cfg.adults === 1 ? "vuxen" : "vuxna"}${cfg.kids ? ` + ${cfg.kids} barn` : ""}`;

export const slotFor = (style: TripStyle): Slot => styleById(style).slot;

export function canGo(dest: DestId, style: TripStyle) {
  const st = styleById(style);
  return (!st.dests || st.dests.includes(dest)) && !!SPOTS[dest][st.slot] && !!DEST_RATES[dest][st.slot];
}

export const firstDest = (style: TripStyle) => DESTS.find((d) => canGo(d.id, style))!.id;

export const spotRates = (cfg: TripConfig) => DEST_RATES[cfg.dest][slotFor(cfg.style)]!;

export function tripCost(cfg: TripConfig, s: Standard): Trip {
  const r = spotRates(cfg);
  const index = Math.max(EXTRA.indexFloor, r.index);
  const { adults, kids, nights } = cfg;
  const crowd = adults + kids;
  const has = (a: TripConfig["addons"][number]) => cfg.addons.includes(a);
  const allInc = has("allinc") && r.allInclusive !== null;
  const eaters = adults + kids * KID.food;
  const doers = adults + kids * KID.activities;
  const jet = s === "jet";
  const ultra = s === "ultra" || jet;
  const base = ultra ? "lyx" : (s as "budget" | "mellan" | "lyx");
  const hours = JET.hours[cfg.dest];
  const leg = DEPARTURE[cfg.from][cfg.dest === "sverige" ? "domestic" : hours > 6 ? "longhaul" : "europe"];
  const slot = slotFor(cfg.style);
  const lodge = slot === "safari" && s !== "budget";

  const perAdult = r.flight[base] * (ultra ? ULTRA.flight : 1) * leg;
  const jetCost = 2 * hours * JET.eurPerHour.find(([h]) => hours <= h)![1] * (1 + JET.fees) * JET.sekPerEur;
  const flight = round(jet ? jetCost : perAdult * (adults + kids * KID.flight));
  const rooms = Math.max(ROOM.single, adults * ROOM.perAdult) + kids * ROOM.perKid;
  const night = round(r.night[base] * (ultra ? ULTRA.night : 1) * rooms);
  const stay = night * nights;
  const foodDay = r.food * STANDARD_FACTOR[s].food * eaters;
  const food = round(lodge ? foodDay * nights * EXTRA.allInclusiveFoodLeft : allInc ? foodDay * nights * EXTRA.allInclusiveFoodLeft + r.allInclusive! * (adults + kids * EXTRA.allInclusiveKid) * nights * (s === "lyx" ? 1.5 : ultra ? ULTRA.allInclusive : 1) : foodDay * nights);
  const trips = has("utflykt") ? Math.ceil(nights / EXTRA.excursionEveryNights) : 0;
  const perDay =
    slot === "ski" ? (LIFT_PASS[cfg.dest] ?? ACTIVITY_PER_DAY.skidor) + SKI_RENTAL * index * STANDARD_FACTOR[s].activities
    : slot === "safari" ? (lodge ? 0 : ACTIVITY_PER_DAY.safari * index) + SAFARI.parkFee
    : ACTIVITY_PER_DAY[cfg.style] * index * STANDARD_FACTOR[s].activities;
  const fun = round(perDay * doers * nights + trips * EXTRA.excursion * index * doers);
  const cars = Math.ceil(crowd / 5);
  const taxis = crowd <= 2 ? 1 : 1.5 * Math.ceil(crowd / 4);
  const moving = round((has("bil") ? (r.car + EXTRA.fuelPerDay) * nights * cars : EXTRA.transportPerDay * index * nights * taxis) * (ultra ? ULTRA.transport : 1));
  const cover = has("skydd") ? round((flight + stay) * EXTRA.cancellationShare) : 0;
  const st = styleById(cfg.style);

  const lines: CostLine[] = [
    {
      id: "flyg",
      label: jet ? "Privatjet tur och retur" : cfg.dest === "sverige" ? "Resa dit och hem" : "Flyg tur och retur",
      detail: jet ? `Hela planet, ca ${String(hours).replace(".", ",")} h per väg` : `${partyText(cfg)}, ${ultra ? "first/business, " : ""}ca ${n(perAdult)} kr per vuxen`,
      amount: flight,
    },
    { id: "boende", label: "Boende", detail: `${nights} ${nights === 1 ? "natt" : "nätter"} × ${n(night)} kr`, amount: stay },
    { id: "mat", label: lodge ? "Dryck och extra" : allInc ? "Allt inkluderat" : "Mat och dryck", detail: lodge ? "Helpension ingår i lodgen" : allInc ? "Mat och dryck på hotellet, plus lite extra" : `ca ${n(foodDay / Math.max(1, eaters))} kr per vuxen och dag`, amount: food },
    {
      id: "aktiviteter",
      label: slot === "ski" ? "Liftkort och skidhyra" : slot === "safari" ? (lodge ? "Parkavgift" : "Gamedrives och parkavgift") : "Aktiviteter",
      detail: slot === "ski" ? `liftkort ca ${n(LIFT_PASS[cfg.dest] ?? 0)} kr per dag` : lodge ? "Gamedrives ingår i lodgen" : trips ? `${st.label.toLowerCase()} + ${trips} guidade utflykter` : st.hint.toLowerCase(),
      amount: fun,
    },
    { id: "transport", label: ultra ? "Privatchaufför" : has("bil") ? (cars > 1 ? `Hyrbil × ${cars}` : "Hyrbil") : "Transport på plats", detail: ultra ? "Privata transfers och chaufför hela vistelsen" : has("bil") ? `${nights} dagar inkl. bensin` : "Transfer, taxi och kollektivtrafik", amount: moving },
  ];
  if (cover) lines.push({ id: "skydd", label: "Avbeställningsskydd", detail: `${Math.round(EXTRA.cancellationShare * 100)} % av resa och boende`, amount: cover });
  const total = lines.reduce((a, l) => a + l.amount, 0);
  return { standard: s, lines, total, fits: total <= budgetById(cfg.budget).max };
}

const ACCOM: Record<Slot, Record<"mellan" | "lyx" | "ultra", string> & { budget: [string, string] }> = {
  beach: { budget: ["Studio", "Enkel lägenhet"], mellan: "Lägenhet", lyx: "Villa med pool", ultra: "Privat villa med personal" },
  city: { budget: ["Studio", "Enkel lägenhet"], mellan: "Lägenhet", lyx: "Takvåning", ultra: "Penthouse-svit" },
  ski: { budget: ["Skidlägenhet", "Skidlägenhet"], mellan: "Hotell vid backen", lyx: "Lyxchalet", ultra: "Chalet med personal" },
  safari: { budget: ["Rest camp", "Rest camp"], mellan: "Safarilodge", lyx: "Lyxlodge", ultra: "Privat lodge" },
};

export function planTrip(cfg: TripConfig, pick?: Standard): TripPlan {
  const options = STANDARDS.map((s) => tripCost(cfg, s));
  const best = [...options].reverse().find((t) => t.fits) ?? options[0];
  const trip = pick ? options.find((t) => t.standard === pick)! : best;
  const slot = slotFor(cfg.style);
  const spot = destById(cfg.dest)[slot]!;
  const a = ACCOM[slot];
  const accom = trip.standard === "budget" ? a.budget[people(cfg) >= 4 ? 1 : 0] : a[trip.standard === "jet" ? "ultra" : trip.standard];
  return { config: cfg, trip, options, place: spot.name, title: `${accom} ${spot.prep} ${spot.name}`, slot };
}

export const standardLabel = (s: Standard) => STANDARD_LABEL[s];
