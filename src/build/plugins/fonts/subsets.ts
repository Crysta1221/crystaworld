import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

import { collectCorpus } from "./corpus.ts";
import { planSlices, type FontWeight } from "./slices.ts";
import { codesToString, toUnicodeRange } from "./unicode-range.ts";

const FONT_DIR = "node_modules/@fontsource/zen-maru-gothic/files";

export type FontSubset = {
  /** Absolute path of the generated woff2 file. */
  file: string;
  weight: FontWeight;
  unicodeRange: string;
  /** Preloaded by the document head. */
  critical: boolean;
};

/**
 * Subsets Zen Maru Gothic to the characters in `src`, one file per slice.
 * See `planSlices` for how glyphs are grouped.
 */
export async function buildZenMaruSubsets(srcDir: string, outDir: string): Promise<FontSubset[]> {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  const sources = new Map<FontWeight, Buffer>();
  const source = async (weight: FontWeight) => {
    const cached = sources.get(weight);
    if (cached) return cached;
    const bytes = await readFile(path.join(FONT_DIR, `zen-maru-gothic-japanese-${weight}-normal.woff2`));
    sources.set(weight, bytes);
    return bytes;
  };

  return Promise.all(
    planSlices(collectCorpus(srcDir)).map(async ({ name, weight, codes, critical }) => {
      const file = path.join(outDir, `zen-maru-gothic-${name}.woff2`);
      const subset = await subsetFont(await source(weight), codesToString(codes), { targetFormat: "woff2" });
      await writeFile(file, subset);
      return { file, weight, unicodeRange: toUnicodeRange(codes), critical };
    }),
  );
}
