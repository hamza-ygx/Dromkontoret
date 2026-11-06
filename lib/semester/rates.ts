import type { DestId, Standard, TripStyle } from "./types";

export interface DestRates {
  flight: Record<Standard, number>;
  night: Record<Standard, number>;
  food: number;
  index: number;
  car: number;
  allInclusive: number | null;
}

export const DEST_RATES: Record<DestId, DestRates> = {
  sverige: { flight: { budget: 900, mellan: 1_400, lyx: 2_600 }, night: { budget: 1_100, mellan: 1_900, lyx: 4_500 }, food: 550, index: 1, car: 600, allInclusive: null },
  spanien: { flight: { budget: 2_200, mellan: 3_500, lyx: 9_000 }, night: { budget: 900, mellan: 1_700, lyx: 4_800 }, food: 400, index: 0.8, car: 350, allInclusive: 450 },
  grekland: { flight: { budget: 2_600, mellan: 4_000, lyx: 9_500 }, night: { budget: 800, mellan: 1_500, lyx: 4_500 }, food: 380, index: 0.75, car: 400, allInclusive: 450 },
  italien: { flight: { budget: 2_200, mellan: 3_500, lyx: 9_000 }, night: { budget: 1_100, mellan: 2_000, lyx: 6_000 }, food: 450, index: 0.9, car: 450, allInclusive: null },
  portugal: { flight: { budget: 2_600, mellan: 4_000, lyx: 10_000 }, night: { budget: 800, mellan: 1_500, lyx: 4_200 }, food: 350, index: 0.7, car: 350, allInclusive: null },
  kroatien: { flight: { budget: 2_400, mellan: 3_800, lyx: 9_000 }, night: { budget: 900, mellan: 1_700, lyx: 5_000 }, food: 400, index: 0.8, car: 450, allInclusive: null },
  turkiet: { flight: { budget: 2_800, mellan: 4_200, lyx: 10_000 }, night: { budget: 600, mellan: 1_200, lyx: 3_800 }, food: 280, index: 0.55, car: 350, allInclusive: 350 },
  frankrike: { flight: { budget: 1_800, mellan: 3_200, lyx: 8_500 }, night: { budget: 1_200, mellan: 2_300, lyx: 7_000 }, food: 500, index: 1, car: 500, allInclusive: null },
  thailand: { flight: { budget: 6_500, mellan: 9_000, lyx: 28_000 }, night: { budget: 400, mellan: 1_000, lyx: 3_500 }, food: 250, index: 0.5, car: 350, allInclusive: 500 },
  usa: { flight: { budget: 5_500, mellan: 8_000, lyx: 26_000 }, night: { budget: 1_300, mellan: 2_400, lyx: 6_500 }, food: 650, index: 1.25, car: 600, allInclusive: null },
  egypten: { flight: { budget: 3_500, mellan: 5_000, lyx: 12_000 }, night: { budget: 500, mellan: 1_000, lyx: 3_200 }, food: 220, index: 0.45, car: 500, allInclusive: 300 },
  japan: { flight: { budget: 8_000, mellan: 11_000, lyx: 35_000 }, night: { budget: 900, mellan: 1_800, lyx: 6_000 }, food: 400, index: 0.9, car: 550, allInclusive: null },
};

export const PARTY = {
  "1": { adults: 1, kids: 0, room: 0.85 },
  "2": { adults: 2, kids: 0, room: 1 },
  "2+2": { adults: 2, kids: 2, room: 1.45 },
  "4": { adults: 4, kids: 0, room: 2 },
} as const;

export const KID = { flight: 0.8, food: 0.6, activities: 0.5 };

export const STANDARD_FACTOR: Record<Standard, { food: number; activities: number }> = {
  budget: { food: 0.65, activities: 0.7 },
  mellan: { food: 1, activities: 1 },
  lyx: { food: 1.8, activities: 1.6 },
};

export const ACTIVITY_PER_DAY: Record<TripStyle, number> = { sol: 120, stad: 350, aventyr: 500, kultur: 300 };

export const EXTRA = {
  transportPerDay: 120,
  fuelPerDay: 150,
  excursion: 900,
  excursionEveryNights: 3,
  allInclusiveFoodLeft: 0.15,
  allInclusiveKid: 0.5,
  cancellationShare: 0.06,
};
