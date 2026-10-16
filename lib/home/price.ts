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
