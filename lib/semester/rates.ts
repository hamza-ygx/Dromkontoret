import type { BaseStandard, DestId, Standard, TripStyle } from "./types";

export interface SpotRates {
  flight: Record<BaseStandard, number>;
  night: Record<BaseStandard, number>;
  food: number;
  index: number;
  car: number;
  allInclusive: number | null;
}

export const DEST_RATES: Record<DestId, { beach: SpotRates; city: SpotRates }> = {
  sverige: {
    beach: { flight: { budget: 600, mellan: 1_400, lyx: 2_800 }, night: { budget: 1_100, mellan: 2_300, lyx: 4_500 }, food: 600, index: 1.0, car: 550, allInclusive: null },
    city: { flight: { budget: 500, mellan: 1_200, lyx: 2_000 }, night: { budget: 900, mellan: 1_900, lyx: 4_000 }, food: 650, index: 1.0, car: 550, allInclusive: null },
  },
  spanien: {
    beach: { flight: { budget: 1_500, mellan: 2_800, lyx: 8_000 }, night: { budget: 1_400, mellan: 2_300, lyx: 5_000 }, food: 425, index: 0.69, car: 250, allInclusive: 450 },
    city: { flight: { budget: 1_800, mellan: 2_900, lyx: 8_500 }, night: { budget: 1_400, mellan: 2_400, lyx: 4_500 }, food: 450, index: 0.69, car: 250, allInclusive: null },
  },
  grekland: {
    beach: { flight: { budget: 1_700, mellan: 3_800, lyx: 11_000 }, night: { budget: 900, mellan: 1_600, lyx: 3_500 }, food: 400, index: 0.69, car: 300, allInclusive: 400 },
    city: { flight: { budget: 1_700, mellan: 3_500, lyx: 10_000 }, night: { budget: 800, mellan: 1_500, lyx: 3_000 }, food: 425, index: 0.69, car: 300, allInclusive: null },
  },
  italien: {
    beach: { flight: { budget: 2_000, mellan: 3_500, lyx: 10_000 }, night: { budget: 1_900, mellan: 3_000, lyx: 9_000 }, food: 600, index: 0.89, car: 400, allInclusive: null },
    city: { flight: { budget: 1_500, mellan: 2_400, lyx: 7_000 }, night: { budget: 1_000, mellan: 2_000, lyx: 5_000 }, food: 550, index: 0.89, car: 400, allInclusive: null },
  },
  portugal: {
    beach: { flight: { budget: 1_800, mellan: 3_500, lyx: 8_000 }, night: { budget: 1_200, mellan: 1_800, lyx: 4_300 }, food: 375, index: 0.59, car: 250, allInclusive: null },
    city: { flight: { budget: 2_500, mellan: 4_500, lyx: 10_000 }, night: { budget: 800, mellan: 1_500, lyx: 3_000 }, food: 375, index: 0.59, car: 250, allInclusive: null },
  },
  kroatien: {
    beach: { flight: { budget: 1_500, mellan: 2_900, lyx: 8_000 }, night: { budget: 800, mellan: 1_800, lyx: 3_000 }, food: 450, index: 0.72, car: 300, allInclusive: null },
    city: { flight: { budget: 1_000, mellan: 2_300, lyx: 7_000 }, night: { budget: 1_400, mellan: 2_500, lyx: 5_000 }, food: 500, index: 0.72, car: 300, allInclusive: null },
  },
  turkiet: {
    beach: { flight: { budget: 1_500, mellan: 3_000, lyx: 8_000 }, night: { budget: 600, mellan: 1_200, lyx: 2_500 }, food: 375, index: 0.63, car: 300, allInclusive: 250 },
    city: { flight: { budget: 1_700, mellan: 3_000, lyx: 8_500 }, night: { budget: 600, mellan: 1_100, lyx: 2_500 }, food: 400, index: 0.63, car: 300, allInclusive: null },
  },
  frankrike: {
    beach: { flight: { budget: 1_600, mellan: 2_900, lyx: 8_500 }, night: { budget: 1_500, mellan: 2_500, lyx: 6_000 }, food: 575, index: 0.94, car: 350, allInclusive: null },
    city: { flight: { budget: 1_500, mellan: 3_500, lyx: 9_000 }, night: { budget: 1_200, mellan: 2_300, lyx: 7_000 }, food: 625, index: 0.94, car: 350, allInclusive: null },
  },
  thailand: {
    beach: { flight: { budget: 6_000, mellan: 10_000, lyx: 22_000 }, night: { budget: 500, mellan: 1_200, lyx: 3_000 }, food: 275, index: 0.39, car: 300, allInclusive: 500 },
    city: { flight: { budget: 5_700, mellan: 9_000, lyx: 20_000 }, night: { budget: 450, mellan: 1_000, lyx: 2_200 }, food: 250, index: 0.39, car: 300, allInclusive: null },
  },
  usa: {
    beach: { flight: { budget: 5_000, mellan: 8_500, lyx: 19_000 }, night: { budget: 1_000, mellan: 1_900, lyx: 4_000 }, food: 700, index: 1.17, car: 450, allInclusive: null },
    city: { flight: { budget: 4_500, mellan: 7_300, lyx: 16_000 }, night: { budget: 1_800, mellan: 3_500, lyx: 7_000 }, food: 800, index: 1.17, car: 450, allInclusive: null },
  },
  egypten: {
    beach: { flight: { budget: 3_300, mellan: 5_300, lyx: 13_000 }, night: { budget: 500, mellan: 900, lyx: 2_000 }, food: 200, index: 0.2, car: 400, allInclusive: 200 },
    city: { flight: { budget: 4_100, mellan: 5_600, lyx: 14_000 }, night: { budget: 400, mellan: 900, lyx: 1_800 }, food: 175, index: 0.2, car: 400, allInclusive: null },
  },
  japan: {
    beach: { flight: { budget: 7_000, mellan: 10_500, lyx: 23_000 }, night: { budget: 800, mellan: 1_500, lyx: 4_000 }, food: 450, index: 0.77, car: 500, allInclusive: null },
    city: { flight: { budget: 7_500, mellan: 10_000, lyx: 22_000 }, night: { budget: 900, mellan: 2_000, lyx: 4_500 }, food: 475, index: 0.77, car: 500, allInclusive: null },
  },
};

export const PARTY = {
  "1": { adults: 1, kids: 0, room: 0.85 },
  "2": { adults: 2, kids: 0, room: 1 },
  "2+2": { adults: 2, kids: 2, room: 1.45 },
  "4": { adults: 4, kids: 0, room: 2 },
} as const;

export const KID = { flight: 0.8, food: 0.6, activities: 0.5 };

export const ULTRA = { flight: 2.5, night: 6, transport: 4, allInclusive: 2.5 };

export const JET = {
  hours: { sverige: 0.7, kroatien: 2.6, frankrike: 2.7, italien: 3, spanien: 3.4, turkiet: 3.6, grekland: 3.7, portugal: 4.3, egypten: 5.1, usa: 10, thailand: 11, japan: 12 } satisfies Record<DestId, number>,
  eurPerHour: [
    [1, 2_800],
    [4.5, 5_500],
    [6, 9_000],
    [Infinity, 15_000],
  ] as const,
  fees: 0.1,
  sekPerEur: 11.15,
};

export const STANDARD_FACTOR: Record<Standard, { food: number; activities: number }> = {
  budget: { food: 0.65, activities: 0.7 },
  mellan: { food: 1, activities: 1 },
  lyx: { food: 1.8, activities: 1.6 },
  ultra: { food: 3.2, activities: 3.5 },
  jet: { food: 3.2, activities: 3.5 },
};

export const ACTIVITY_PER_DAY: Record<TripStyle, number> = { sol: 120, stad: 350, aventyr: 500, kultur: 300 };

export const EXTRA = {
  transportPerDay: 120,
  fuelPerDay: 150,
  excursion: 900,
  excursionEveryNights: 3,
  allInclusiveFoodLeft: 0.15,
  allInclusiveKid: 0.5,
  cancellationShare: 0.05,
  indexFloor: 0.35,
};
