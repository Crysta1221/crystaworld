import { readFileSync } from "node:fs";
import { join } from "node:path";

export type OgFont = {
  name: string;
  data: Buffer;
  weight: 500 | 700;
  style: "normal";
};

const FILES = [
  ["zen-maru-gothic-japanese-500-normal.woff", 500],
  ["zen-maru-gothic-latin-500-normal.woff", 500],
  ["zen-maru-gothic-japanese-700-normal.woff", 700],
  ["zen-maru-gothic-latin-700-normal.woff", 700],
] as const;

/**
 * Zen Maru Gothic is the site's Japanese face. Japanese and Latin subsets
 * are both registered so Satori can fall back per glyph.
 */
export function loadOgFonts(root = process.cwd()): OgFont[] {
  const dir = join(root, "node_modules/@fontsource/zen-maru-gothic/files");
  return FILES.map(([file, weight]) => ({
    name: "Zen Maru Gothic",
    data: readFileSync(join(dir, file)),
    weight,
    style: "normal" as const,
  }));
}
