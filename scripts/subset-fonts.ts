import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import subsetFont from "subset-font";

const FONT_DIR = "node_modules/@fontsource/zen-maru-gothic/files";
const CRITICAL_BOLD = "くりすた";

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist" || entry.name.startsWith(".")) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(tsx|ts|md|html)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function collectCodes(value: string): number[] {
  const seen = new Set<number>();
  const list: number[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const code = value.codePointAt(index);
    if (code === undefined) continue;
    if (code > 0xffff) index += 1;
    if (code <= 0x7f || code === 0xfeff || seen.has(code)) continue;
    seen.add(code);
    list.push(code);
  }
  list.sort((a, b) => a - b);
  return list;
}

function codesToString(codes: readonly number[]): string {
  let text = "";
  for (let index = 0; index < codes.length; index += 10000) {
    text += String.fromCodePoint(...codes.slice(index, index + 10000));
  }
  return text;
}

function toUnicodeRange(list: readonly number[]): string {
  if (list.length === 0) return "";
  const parts: string[] = [];
  let start = list[0] ?? 0;
  let prev = start;
  for (let index = 1; index <= list.length; index += 1) {
    const code = list[index];
    if (code === prev + 1) {
      prev = code ?? prev;
      continue;
    }
    const hex = (value: number) => value.toString(16).toUpperCase();
    parts.push(start === prev ? `U+${hex(start)}` : `U+${hex(start)}-${hex(prev)}`);
    start = code ?? 0;
    prev = start;
  }
  return parts.join(", ");
}

function isHomeSource(file: string): boolean {
  const normalized = file.replaceAll("\\", "/");
  return (
    normalized.includes("/features/home/") ||
    normalized.includes("/components/header/") ||
    normalized.includes("/components/footer/") ||
    normalized.includes("/components/layout/") ||
    normalized.endsWith("/routes/__root.tsx") ||
    normalized.endsWith("/routes/index.tsx") ||
    normalized.endsWith("index.html") ||
    normalized.includes("/features/locale/") ||
    normalized.includes("/features/theme/") ||
    normalized.endsWith("/scroll-top-button.tsx")
  );
}

async function writeSubset(weight: 500 | 700, chars: string, filename: string, outDir: string) {
  if (chars.length === 0) return;
  const input = readFileSync(
    path.join(FONT_DIR, `zen-maru-gothic-japanese-${weight}-normal.woff2`),
  );
  const subset = await subsetFont(input, chars, { targetFormat: "woff2" });
  writeFileSync(path.join(outDir, filename), subset);
}

function face(file: string, weight: 500 | 700, unicodeRange: string): string {
  if (unicodeRange.length === 0) return "";
  return `@font-face {
  font-family: "Zen Maru Gothic";
  src: url("/fonts/${file}") format("woff2");
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
  unicode-range: ${unicodeRange};
}
`;
}

/**
 * Subset Zen Maru Gothic to the characters in the source tree.
 * The home page keeps its own files so the first paint does not download article glyphs.
 */
export async function buildZenMaruSubsets(outDir: string): Promise<string> {
  mkdirSync(outDir, { recursive: true });

  const files = [...walk("src"), "index.html"];
  let corpus = "";
  let homeCorpus = "";
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    corpus += text;
    if (isHomeSource(file)) homeCorpus += text;
  }

  const codes = collectCodes(corpus);
  const homeCodes = collectCodes(homeCorpus);
  const homeCodeSet = new Set(homeCodes);
  const restBodyCodes = codes.filter((code) => !homeCodeSet.has(code));
  const criticalCodes = collectCodes(CRITICAL_BOLD);
  const criticalSet = new Set(criticalCodes);
  const restBoldCodes = codes.filter((code) => !criticalSet.has(code));

  await writeSubset(500, codesToString(homeCodes), "zen-maru-gothic-500.woff2", outDir);
  await writeSubset(500, codesToString(restBodyCodes), "zen-maru-gothic-500-rest.woff2", outDir);
  await writeSubset(700, CRITICAL_BOLD, "zen-maru-gothic-700.woff2", outDir);
  await writeSubset(700, codesToString(restBoldCodes), "zen-maru-gothic-700-rest.woff2", outDir);

  return [
    face("zen-maru-gothic-500.woff2", 500, toUnicodeRange(homeCodes)),
    face("zen-maru-gothic-500-rest.woff2", 500, toUnicodeRange(restBodyCodes)),
    face("zen-maru-gothic-700.woff2", 700, toUnicodeRange(criticalCodes)),
    face("zen-maru-gothic-700-rest.woff2", 700, toUnicodeRange(restBoldCodes)),
  ].join("\n");
}

const FONTS_CSS = path.resolve("src/app/fonts.css");

/**
 * Production builds subset the font. Development keeps the full Japanese face.
 * Tailwind reads fonts.css from disk, so the build swaps that file and restores it afterwards.
 */
export function zenMaruSubsetPlugin(): Plugin {
  let original = "";
  let restore: (() => void) | undefined;

  const putBack = () => {
    if (!restore) return;
    restore();
    restore = undefined;
  };

  return {
    name: "zen-maru-subsets",
    apply: "build",
    async buildStart() {
      original = readFileSync(FONTS_CSS, "utf8");
      restore = () => {
        writeFileSync(FONTS_CSS, original);
        process.removeListener("exit", putBack);
      };
      process.once("exit", putBack);
      const css = await buildZenMaruSubsets(path.resolve("public/fonts"));
      writeFileSync(FONTS_CSS, css);
    },
    buildEnd: putBack,
    closeBundle: putBack,
    transformIndexHtml(html) {
      const preload = ["/fonts/zen-maru-gothic-500.woff2", "/fonts/zen-maru-gothic-700.woff2"]
        .map(
          (href) =>
            `<link rel="preload" href="${href}" as="font" type="font/woff2" crossorigin />`,
        )
        .join("\n    ");
      return html.replace("</head>", `    ${preload}\n  </head>`);
    },
  };
}
