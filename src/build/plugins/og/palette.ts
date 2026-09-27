/** Pastel frame colors. Green matches the blue set's lightness, for memo cards. */
export type OgPalette = {
  frame: string;
  pill: string;
  track: string;
  stripe: string;
  square: string;
};

export const bluePalette: OgPalette = {
  frame: "#c5d4ee",
  pill: "#d5e2f6",
  track: "#e7eef9",
  stripe: "#8eb4e8",
  square: "#6f97d4",
};

export const greenPalette: OgPalette = {
  frame: "#c5e4d0",
  pill: "#d5f3e2",
  track: "#e7f6ee",
  stripe: "#8ed4a8",
  square: "#6fb48a",
};
