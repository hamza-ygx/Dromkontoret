import { BLACK, type Part } from "../home/furnish";
import type { OfficePalette } from "./palette";

const GOODS = (p: OfficePalette) => [p.accent, p.accent2, p.textile, p.plant];

export function gondola(p: OfficePalette, len: number, body: string): Part[] {
  const g = GOODS(p);
  return [
    [0, 0, 0, 0.9, len, 1.45, body],
    [-0.04, 0.1, 0.35, 0.04, len - 0.2, 0.9, g[Math.round(len * 3) % g.length]],
    [0.9, 0.1, 0.35, 0.04, len - 0.2, 0.9, g[(Math.round(len * 3) + 1) % g.length]],
  ];
}

export function wallShelf(p: OfficePalette, len: number, body: string): Part[] {
  const g = GOODS(p);
  return [
    [0, 0, 0, len, 0.45, 2.0, body],
    [0.1, 0.45, 0.4, len - 0.2, 0.03, 1.3, g[Math.round(len) % g.length]],
  ];
}

export const checkout = (p: OfficePalette): Part[] => [
  [0, 0, 0, 1.8, 0.7, 0.9, p.cabinet],
  [-0.05, -0.05, 0.9, 1.9, 0.8, 0.04, p.counter],
  [1.2, 0.15, 0.94, 0.35, 0.3, 0.3, BLACK, { className: "screen" }],
];

export const stockShelf = (p: OfficePalette, len: number): Part[] => [[0, 0, 0, len, 0.5, 2.0, p.steel]];

export const palletRack = (len: number): Part[] => [
  [0, 0, 0, len, 1.1, 0.12, "#e0662b"],
  [0, 0, 1.2, len, 1.1, 0.12, "#e0662b"],
  [0, 0, 2.4, len, 1.1, 0.12, "#e0662b"],
  [0.1, 0.1, 0.12, len - 0.2, 0.9, 0.8, "#c9a77c"],
  [0.1, 0.1, 1.32, len - 0.2, 0.9, 0.7, "#b8b2a7"],
  [0, 0, 0, 0.1, 1.1, 2.6, "#2f5d8a"],
  [len - 0.1, 0, 0, 0.1, 1.1, 2.6, "#2f5d8a"],
];

export const timberRack = (len: number): Part[] => [
  [0, 0, 0, len, 1.2, 0.1, "#55595f"],
  [0.1, 0.1, 0.1, len - 0.2, 1.0, 0.7, "#d8b98a"],
  [0, 0, 0, 0.12, 0.12, 2.4, "#55595f"],
  [len - 0.12, 0, 0, 0.12, 0.12, 2.4, "#55595f"],
];

export const van = (c: string): Part[] => [
  [0, 0, 0.3, 2.0, 5.3, 1.9, c],
  [0.1, 0.05, 1.4, 1.8, 0.02, 0.6, "#2b3138"],
];

export const lift = (): Part[] => [
  [0, 0, 0, 0.35, 0.35, 2.6, "#2f5d8a"],
  [2.65, 0, 0, 0.35, 0.35, 2.6, "#2f5d8a"],
  [0.35, -0.8, 0.12, 0.25, 1.9, 0.08, "#55595f"],
  [2.4, -0.8, 0.12, 0.25, 1.9, 0.08, "#55595f"],
];

export const tyre = (): Part[] => [
  [0, 0, 0, 0.9, 0.9, 1.0, "#c43d3d"],
  [1.1, 0, 0, 0.8, 0.7, 1.1, "#2b3138"],
  [1.25, 0.7, 0.75, 0.5, 0.25, 0.5, "#1d1f22", { round: true }],
];

export const compressor = (): Part[] => [
  [0, 0, 0, 1.2, 0.6, 0.9, "#2f5d8a"],
  [0.15, 0.1, 0.9, 0.5, 0.4, 0.35, "#55595f", { round: true }],
];

export const workbench = (p: OfficePalette, w: number): Part[] => [
  [0, 0, 0, w, 0.75, 0.9, p.steel],
  [0, 0, 0.9, w, 0.04, 1.0, "#4a5560"],
];

export const cart = (): Part[] => [
  [0, 0, 0, 0.7, 0.5, 0.95, "#c43d3d"],
  [0.1, 0.1, 0.95, 0.5, 0.05, 0.35, BLACK, { className: "screen" }],
];
