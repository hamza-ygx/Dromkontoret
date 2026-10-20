import { EXTRA_PRICE } from "./catalog";
import { perM2 as placePerM2, placeById } from "./places";
import type { Plan } from "./types";

export interface Estimate {
  price: number;
  perM2: number;
  extras: number;
  furniture: number;
}

const round = (v: number, step: number) => Math.round(v / step) * step;

export function estimate(plan: Plan): Estimate {
  const { type, area, extras } = plan.config;
  const perM2 = placePerM2(type, placeById(area));
  const extraSum = extras.reduce((sum, e) => sum + (EXTRA_PRICE[e][type] ?? 0), 0);
  const price = round(plan.livingArea * perM2 + extraSum, 50_000);
  const furniture = plan.items.reduce((sum, i) => sum + i.label.price, 0);
  return { price, perM2, extras: extraSum, furniture };
}

export const kr = (v: number) => `${Math.round(v).toLocaleString("sv-SE")} kr`;

/** Monthly fee: avgift for a bostadsrätt, driftkostnad for houses (rough levels). */
export function monthlyFee(plan: Plan): { label: string; amount: number } {
  const { type, extras } = plan.config;
  if (type === "lagenhet") return { label: "Avgift", amount: round(plan.livingArea * 55, 10) };
  const perM2 = type === "villa" ? 42 : type === "radhus" ? 38 : 30;
  const extra = (extras.includes("pool") ? (type === "stuga" ? 300 : 900) : 0) + (extras.includes("bastu") ? 150 : 0);
  return { label: "Driftkostnad", amount: round(plan.livingArea * perM2 + extra, 10) };
}

export interface Loan {
  down: number;
  loan: number;
  interest: number;
  amortization: number;
  fee: number;
  total: number;
  ltv: number;
  required: number;
}

/** Monthly cost with the Swedish amortization requirement by loan-to-value (70 % → 2 %, 50 % → 1 %). */
export function monthly(price: number, fee: number, downPct: number, ratePct: number, amortPct: number): Loan {
  const down = (price * downPct) / 100;
  const loan = price - down;
  const interest = (loan * ratePct) / 1200;
  const amortization = (loan * amortPct) / 1200;
  const ltv = 100 - downPct;
  return { down, loan, interest, amortization, fee, total: interest + amortization + fee, ltv, required: ltv > 70 ? 2 : ltv > 50 ? 1 : 0 };
}
