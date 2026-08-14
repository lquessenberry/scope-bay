export type GridId = "2" | "3" | "4";

export type GridPreset = {
  id: GridId;
  label: string;
  hint: string;
};

export const GRID_PRESETS: GridPreset[] = [
  { id: "2", label: "2-wide", hint: "Pair" },
  { id: "3", label: "3-wide", hint: "Triad" },
  { id: "4", label: "2 × 2", hint: "Four-up" },
];

export const GRID_CLASS: Record<GridId, string> = {
  "2": "grid grid-cols-2 gap-3",
  "3": "grid grid-cols-2 gap-3 sm:grid-cols-3",
  "4": "grid grid-cols-2 gap-3",
};
