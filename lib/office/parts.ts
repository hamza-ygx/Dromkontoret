import { BLACK, PORCELAIN, type Part } from "../home/furnish";
import type { OfficePalette } from "./palette";
import type { Style } from "./types";

export const I = 0.14;
export const raise = (parts: Part[], z: number): Part[] => parts.map(([x, v, zz, w, d, h, c, o]) => [x, v, zz + z, w, d, h, c, o]);
export const shift = (parts: Part[], dx: number): Part[] => parts.map(([x, v, z, w, d, h, c, o]) => [x + dx, v, z, w, d, h, c, o]);
const flip = (parts: Part[], depth: number): Part[] => parts.map(([x, v, z, w, d, h, c, o]) => [x, depth - v - d, z, w, d, h, c, o]);

export const WORKSTATION_D = 1.45;

export function workstation(p: OfficePalette, s: Style, facing: 1 | -1, desk = 1.5): Part[] {
  const chair = s === "startup" ? p.accent : s === "kreativt" ? p.accent : p.dark;
  const parts: Part[] = [
    [desk / 2 - 0.25, 0.04, 0.46, 0.5, 0.08, 0.5, chair],
    [desk / 2 - 0.25, 0.1, 0, 0.5, 0.48, 0.46, chair],
    [0, 0.65, 0, desk, 0.8, 0.74, p.wood],
    [desk / 2 - 0.3, 1.32, 0.74, 0.6, 0.04, 0.38, BLACK, { className: "screen" }],
  ];
  if (s === "exklusiv") parts.push([desk / 2 + 0.32, 1.28, 0.74, 0.5, 0.04, 0.36, BLACK, { className: "screen" }]);
  return facing === 1 ? parts : flip(parts, WORKSTATION_D);
}

export const counter = (p: OfficePalette, w: number): Part[] => [
  [0, 0, 0, w, 0.6, 1.05, p.cabinet],
  [-0.05, -0.08, 1.05, w + 0.1, 0.72, 0.04, p.counter],
  [w / 2 - 0.25, 0.85, 0, 0.5, 0.48, 0.46, p.dark],
  [w / 2 - 0.3, 0.4, 0.74, 0.6, 0.04, 0.36, BLACK, { className: "screen" }],
];

export const sofa = (c: string, w: number): Part[] => [
  [0, 0, 0, w, 0.88, 0.42, c],
  [0, 0, 0.42, w, 0.22, 0.4, c],
  [0, 0, 0.42, 0.18, 0.88, 0.2, c],
  [w - 0.18, 0, 0.42, 0.18, 0.88, 0.2, c],
];

export const table = (c: string, w: number, d: number, h = 0.74): Part[] => [[0, 0, 0, w, d, h, c]];

export const wallScreen = (w: number): Part[] => [[0, 0, 0.95, w, 0.06, w * 0.57, BLACK, { className: "screen" }]];

export function fun(p: OfficePalette, s: Style): { w: number; d: number; parts: Part[] } {
  if (s === "startup")
    return { w: 2.74, d: 1.53, parts: [[0, 0, 0, 2.74, 1.53, 0.76, "#1f5f8b"], [1.355, 0, 0.76, 0.03, 1.53, 0.15, "#f4f4f2"]] };
  if (s === "exklusiv")
    return { w: 2.5, d: 1.4, parts: [[0, 0, 0, 2.5, 1.4, 0.8, p.wood], [0.12, 0.12, 0.8, 2.26, 1.16, 0.01, "#2f6b4f", { flat: true }]] };
  if (s === "kreativt")
    return { w: 0.7, d: 0.8, parts: [[0, 0, 0, 0.7, 0.8, 1.75, p.accent2], [0.08, 0.3, 1.0, 0.54, 0.04, 0.45, BLACK, { className: "screen" }]] };
  return { w: 2.0, d: 0.9, parts: [[0, 0, 0, 1.0, 0.32, 1.9, p.wood], [1.15, 0.05, 0, 0.8, 0.82, 0.42, p.accent2], [1.15, 0.05, 0.42, 0.8, 0.2, 0.45, p.accent2]] };
}

export const treadmill = (): Part[] => [
  [0, 0, 0, 0.8, 1.9, 0.25, "#2b2d42"],
  [0.05, 0, 0.25, 0.7, 0.12, 1.1, "#2b2d42"],
];

export const weights = (p: OfficePalette): Part[] => [
  [0, 0, 0, 1.6, 0.45, 1.0, BLACK],
  [0.6, 0.75, 0, 0.4, 1.2, 0.45, p.accent],
];

export const steelBench = (p: OfficePalette, w: number, d = 0.7, h = 0.9): Part[] => [[0, 0, 0, w, d, h, p.steel]];

export const combi = (p: OfficePalette): Part[] => [
  [0, 0, 0, 0.9, 0.8, 0.7, p.steel],
  [0, 0, 0.7, 0.9, 0.8, 1.05, p.steel],
  [0.1, 0.8, 0.9, 0.6, 0.01, 0.65, "#3a4049"],
];

export const rangeLine = (p: OfficePalette, w: number): Part[] => [
  [0, 0, 0, w, 0.9, 0.9, p.steel],
  [0.1, 0.1, 0.9, w - 0.2, 0.7, 0.01, BLACK, { flat: true }],
  [-0.1, 0, 1.95, w + 0.2, 1.1, 0.45, p.steel],
];

export const dishLine = (p: OfficePalette): Part[] => [
  [0, 0, 0, 1.2, 0.7, 0.9, p.steel],
  [1.2, 0, 0, 0.7, 0.7, 0.85, p.steel],
  [1.2, 0, 0.85, 0.7, 0.7, 0.75, p.steel],
  [1.9, 0, 0, 1.2, 0.7, 0.9, p.steel],
];

export const coldRoom = (w: number, d: number, c: string): Part[] => [
  [0, 0, 0, w, d, 2.2, c],
  [w / 2 - 0.4, d, 0, 0.8, 0.02, 2.0, "#9fb0bf"],
];

export const tallUnit = (c: string, w: number, d = 0.5, h = 1.9): Part[] => [[0, 0, 0, w, d, h, c]];

export function table4(p: OfficePalette, s: Style): Part[] {
  const top = s === "exklusiv" ? PORCELAIN : p.wood;
  const chair = s === "startup" ? p.accent : s === "kreativt" ? p.dark : s === "exklusiv" ? p.accent : p.wood;
  return [
    [0.45, 0.45, 0, 0.8, 0.8, 0.75, top],
    [0.64, 0, 0, 0.42, 0.42, 0.46, chair],
    [0.64, 1.38, 0, 0.42, 0.42, 0.46, chair],
    [0, 0.64, 0, 0.42, 0.42, 0.46, chair],
    [1.28, 0.64, 0, 0.42, 0.42, 0.46, chair],
  ];
}
export const TABLE4 = 1.7;

export const barCounter = (p: OfficePalette, w: number): Part[] => [
  [0, 0, 0, w, 0.6, 1.1, p.wood],
  [-0.05, -0.15, 1.1, w + 0.1, 0.8, 0.05, p.counter],
];

export const stools = (p: OfficePalette, n: number): Part[] =>
  Array.from({ length: n }, (_, i) => [i * 0.6, 0, 0, 0.4, 0.4, 0.75, p.dark, { round: true }] as Part);

export const backBar = (p: OfficePalette, w: number): Part[] => [
  [0, 0, 0, w, 0.55, 0.9, p.dark],
  [0, 0, 1.3, w, 0.3, 0.9, p.wood],
];

export const espresso = (p: OfficePalette): Part[] => [[0, 0, 0, 0.7, 0.5, 0.45, p.steel]];
export const pos = (): Part[] => [[0, 0, 0, 0.35, 0.3, 0.3, BLACK, { className: "screen" }]];

export const car = (c: string): Part[] => [
  [0, 0, 0.25, 1.85, 4.3, 0.7, c],
  [0.15, 1.1, 0.95, 1.55, 2.1, 0.5, "#2b3138"],
];

export const charger = (p: OfficePalette): Part[] => [
  [0, 0, 0, 0.3, 0.22, 1.3, "#f4f4f2"],
  [0.08, 0.22, 0.85, 0.14, 0.01, 0.2, p.accent2],
];
