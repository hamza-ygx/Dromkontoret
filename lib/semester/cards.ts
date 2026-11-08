import { JET_CARD, SPOTS, STAYS } from "./spots";
import type { TripPlan } from "./types";

export interface TripCard {
  id: string;
  kind: "stay" | "jet" | "sight";
  name: string;
  line: string;
  price: string;
}

const n = (v: number) => Math.round(v).toLocaleString("sv-SE");

export const spotFor = (plan: TripPlan) => SPOTS[plan.config.dest][plan.slot]!;

export function cardsFor(plan: TripPlan): TripCard[] {
  const { trip, config } = plan;
  const stay = STAYS[trip.standard][plan.slot];
  const night = trip.lines.find((l) => l.id === "boende")!.amount / config.nights;
  const out: TripCard[] = [{ id: stay.id, kind: "stay", name: stay.name, line: stay.line, price: `ca ${n(night)} kr per natt` }];
  if (trip.standard === "jet") out.push({ id: JET_CARD.id, kind: "jet", name: JET_CARD.name, line: JET_CARD.line, price: `ca ${n(trip.lines.find((l) => l.id === "flyg")!.amount)} kr tur och retur` });
  for (const s of spotFor(plan).sights) out.push({ id: s.id, kind: "sight", name: s.name, line: s.line, price: s.price ? `ca ${n(s.price)} kr per person` : "Gratis" });
  return out;
}
