import { placeById } from "../home/places";
import { GOODS_SHARE, OTHER_SHARE, PAY, RENT, RENT_SEGMENT, REVENUE_PER_STAFF, SALARY } from "./rates";
import type { OfficePlan, RevenueLevel } from "./types";

export const LEVELS: { id: RevenueLevel; label: string }[] = [
  { id: "low", label: "Låg" },
  { id: "normal", label: "Normal" },
  { id: "high", label: "Hög" },
];

const round = (v: number, step: number) => Math.round(v / step) * step;
export const pct = (v: number) => `${(v * 100).toFixed(2).replace(".", ",").replace(/,?0+$/, "")} %`;

export interface OfficeCosts {
  area: number;
  rentPerM2: number;
  rent: number;
  salary: number;
  wages: number;
  employerFees: number;
  pension: number;
  personnel: number;
  furnishing: number;
  depreciation: number;
  other: number;
  total: number;
  goodsShare: number;
  breakEven: number;
}

export function officeCosts(plan: OfficePlan): OfficeCosts {
  const { industry, area: placeId } = plan.config;
  const v = placeById(placeId).villa / 1000;
  const rentPerM2 = round(RENT[RENT_SEGMENT[industry]](v), 10);
  const rent = round((plan.floorArea * rentPerM2) / 12, 100);
  const salary = SALARY[industry];
  const wages = salary * plan.staff;
  const employerFees = round(wages * PAY.employerFee, 100);
  const pension = round(wages * (PAY.personnelMultiplier - 1 - PAY.employerFee), 100);
  const personnel = wages + employerFees + pension;
  const furnishing = plan.items.reduce((a, i) => a + i.label.price, 0);
  const depreciation = round(furnishing / PAY.depreciationYears / 12, 100);
  const other = round((OTHER_SHARE[industry] * REVENUE_PER_STAFF[industry].normal * plan.staff) / 12, 100);
  const total = rent + personnel + depreciation + other;
  const goodsShare = GOODS_SHARE[industry];
  return { area: plan.floorArea, rentPerM2, rent, salary, wages, employerFees, pension, personnel, furnishing, depreciation, other, total, goodsShare, breakEven: round(total / (1 - goodsShare), 1000) };
}

export interface Outcome {
  revenue: number;
  goods: number;
  profit: number;
  tax: number;
  kept: number;
}

export const revenueFor = (plan: OfficePlan, level: RevenueLevel) => round((REVENUE_PER_STAFF[plan.config.industry][level] * plan.staff) / 12, 1000);

export function outcome(plan: OfficePlan, c: OfficeCosts, level: RevenueLevel): Outcome {
  const revenue = revenueFor(plan, level);
  const goods = round(revenue * c.goodsShare, 100);
  const profit = revenue - goods - c.total;
  const tax = profit > 0 ? round(profit * PAY.corporateTax, 100) : 0;
  return { revenue, goods, profit, tax, kept: profit - tax };
}
