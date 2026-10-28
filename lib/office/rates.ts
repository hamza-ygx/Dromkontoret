import type { Industry, RevenueLevel } from "./types";

export const SPACE = {
  officePerStaff: 15,
  officeMin: 40,
  seatsPerStaff: 5.5,
  minSeats: 12,
  diningPerSeat: 1.3,
  kitchenShare: 0.3,
  byggOfficeShare: 0.2,
  storagePerTrade: 10,
  shopSalesBase: 40,
  shopSalesExponent: 0.8,
  stockShare: 0.25,
  liftsPerStaff: 0.5,
  vansPerStaff: 1 / 3,
};

export const PAY = {
  employerFee: 0.3142,
  personnelMultiplier: 1.42,
  corporateTax: 0.206,
  depreciationYears: 5,
};

export const SALARY: Record<Industry, number> = {
  konsult: 48_000,
  restaurang: 31_500,
  bygg: 41_700,
  butik: 34_000,
  verkstad: 36_000,
};

const officeA = (v: number) => 900 + 1.1 * v * v;
const retailA = (v: number) => Math.max(900, 840 * Math.sqrt(v) - 1330);
export const RENT = {
  office: officeA,
  street: (v: number) => Math.max(800, 0.55 * retailA(v)),
  industrial: (v: number) => 450 + 15 * v,
};

export const RENT_SEGMENT: Record<Industry, keyof typeof RENT> = {
  konsult: "office",
  restaurang: "street",
  butik: "street",
  bygg: "industrial",
  verkstad: "industrial",
};

export const REVENUE_PER_STAFF: Record<Industry, Record<RevenueLevel, number>> = {
  konsult: { low: 1_000_000, normal: 1_250_000, high: 1_600_000 },
  restaurang: { low: 850_000, normal: 1_150_000, high: 1_500_000 },
  bygg: { low: 1_200_000, normal: 1_600_000, high: 2_200_000 },
  butik: { low: 1_600_000, normal: 2_200_000, high: 3_000_000 },
  verkstad: { low: 1_100_000, normal: 1_500_000, high: 2_000_000 },
};

export const GOODS_SHARE: Record<Industry, number> = {
  konsult: 0,
  restaurang: 0.32,
  bygg: 0.36,
  butik: 0.55,
  verkstad: 0.38,
};

export const OTHER_SHARE: Record<Industry, number> = {
  konsult: 0.18,
  restaurang: 0.1,
  bygg: 0.08,
  butik: 0.1,
  verkstad: 0.08,
};
