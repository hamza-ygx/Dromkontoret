import type { Palette } from "../home/catalog";
import type { Style } from "./types";

export interface OfficePalette extends Palette {
  carpet: string;
  steel: string;
  concrete: string;
}

export const OFFICE_PALETTE: Record<Style, OfficePalette> = {
  startup: { wall: "#f5f3ef", wallTop: "#2b2d42", floor: "#d9c3a1", tile: "#dfe6e9", accent: "#2ec4b6", accent2: "#ff6b9a", textile: "#ffd23f", wood: "#d4b48c", dark: "#2b2d42", metal: "#9aa3ad", rug: "#7b5ea7", plant: "#4caf50", cabinet: "#f4f4f2", counter: "#d9d4cc", light: "#ffe3a3", carpet: "#c9ced6", steel: "#c3c9cf", concrete: "#bdbab4" },
  skandi: { wall: "#f7f5f0", wallTop: "#3a3f47", floor: "#d8bf98", tile: "#e9e6df", accent: "#b9c2c9", accent2: "#7d9a78", textile: "#e8e2d6", wood: "#c9a77c", dark: "#4a4f57", metal: "#b8b2a7", rug: "#ece6da", plant: "#5f8f5a", cabinet: "#f2efe8", counter: "#eeebe5", light: "#f3e3c3", carpet: "#d6d2c8", steel: "#c8ccd0", concrete: "#c9c5bd" },
  exklusiv: { wall: "#ece7df", wallTop: "#1d2a24", floor: "#6b4a33", tile: "#e8e4dc", accent: "#2f5d50", accent2: "#c9a24b", textile: "#3c4a63", wood: "#5c3b26", dark: "#1d1f22", metal: "#c9a24b", rug: "#8a7660", plant: "#3f7d4f", cabinet: "#22302a", counter: "#efece6", light: "#f5d58c", carpet: "#4d5560", steel: "#c8ccd0", concrete: "#a9a59e" },
  kreativt: { wall: "#e9e5df", wallTop: "#3d3a37", floor: "#a8a49d", tile: "#d9d6d0", accent: "#b5523b", accent2: "#3d5a80", textile: "#e0a458", wood: "#9c6b45", dark: "#2f2c29", metal: "#6f6a64", rug: "#3d5a80", plant: "#4f8a4b", cabinet: "#3d3a37", counter: "#cfcac2", light: "#ffd59a", carpet: "#8d8a85", steel: "#b9bec4", concrete: "#9b978f" },
};
