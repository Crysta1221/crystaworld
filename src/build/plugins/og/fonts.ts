import { readFileSync } from "node:fs";
import { join } from "node:path";

export type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 700;
  style: "normal";
};

const FILES = [
  ["zen-maru-gothic-japanese-500-normal.woff", 500],
  ["zen-maru-gothic-latin-500-normal.woff", 500],
  ["zen-maru-gothic-japanese-700-normal.woff", 700],
  ["zen-maru-gothic-latin-700-normal.woff", 700],
] as const;

/**
 * Loads Zen Maru Gothic as the baseline Japanese face and Natadecoco Gothic
 * for the branded Crystaworld title.
 */
export function loadOgFonts(root = process.cwd()): OgFont[] {
  const dir = join(root, "node_modules/@fontsource/zen-maru-gothic/files");
  const fonts: OgFont[] = FILES.map(([file, weight]) => ({
    name: "Zen Maru Gothic",
    data: readFileSync(join(dir, file)),
    weight,
    style: "normal" as const,
  }));

  const natadecocoPath = join(root, "public/fonts/Natadecoco-gothic.otf");
  fonts.push({
    name: "Natadecoco",
    data: readFileSync(natadecocoPath),
    weight: 400,
    style: "normal" as const,
  });

  return fonts;
}
