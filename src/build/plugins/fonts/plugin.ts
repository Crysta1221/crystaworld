import path from "node:path";
import type { Plugin } from "vite";

import { buildZenMaruSubsets, type FontSubset } from "./subsets.ts";

const FONTS_CSS = path.resolve("src/app/fonts.css");
const CACHE_DIR = path.resolve("node_modules/.cache/crystaworld-fonts");
const PRELOADS_ID = "virtual:crystaworld/font-preloads";
const RESOLVED_PRELOADS_ID = `\0${PRELOADS_ID}`;

/**
 * Production builds swap `src/app/fonts.css` for subset `@font-face` rules.
 * The subset files are imported by relative URL, so Vite hashes and emits them under /assets.
 * `virtual:crystaworld/font-preloads` exports the preloaded URLs (empty in dev,
 * where fonts.css keeps the full @fontsource faces).
 */
export function zenMaruFontsPlugin(): Plugin {
  let isBuild = false;
  let pending: Promise<FontSubset[]> | undefined;
  const subsets = () => (pending ??= buildZenMaruSubsets(path.resolve("src"), CACHE_DIR));

  return {
    name: "crystaworld:zen-maru-fonts",
    enforce: "pre",
    config() {
      // Only critical slices may become data URLs; the rest must stay separate
      // files so pages download them on demand through unicode-range.
      return {
        build: {
          assetsInlineLimit: (file: string) => (isSubsetFile(file) && !isCriticalFile(file) ? false : undefined),
        },
      };
    },
    configResolved(config) {
      isBuild = config.command === "build";
    },
    resolveId(id) {
      return id === PRELOADS_ID ? RESOLVED_PRELOADS_ID : undefined;
    },
    async load(id) {
      if (id === RESOLVED_PRELOADS_ID) {
        return isBuild ? preloadModule(await subsets()) : "export default [];";
      }
      if (isBuild && path.resolve(id.split("?")[0] ?? id) === FONTS_CSS) {
        return fontFaceCss(await subsets());
      }
      return undefined;
    },
  };
}

function preloadModule(subsets: readonly FontSubset[]): string {
  const preloaded = subsets.filter((subset) => subset.critical);
  const imports = preloaded.map(
    (subset, index) => `import font${index} from ${JSON.stringify(`${toPosix(subset.file)}?url`)};`,
  );
  const names = preloaded.map((_subset, index) => `font${index}`);
  // Vite inlines tiny subsets as data URLs; those need no preload.
  const list = `[${names.join(", ")}].filter((href) => !href.startsWith("data:"))`;
  return `${imports.join("\n")}\nexport default ${list};\n`;
}

function fontFaceCss(subsets: readonly FontSubset[]): string {
  return subsets
    .map((subset) => {
      const url = toPosix(path.relative(path.dirname(FONTS_CSS), subset.file));
      return `@font-face {
  font-family: "Zen Maru Gothic";
  src: url("${url}") format("woff2");
  font-weight: ${subset.weight};
  font-style: normal;
  font-display: swap;
  unicode-range: ${subset.unicodeRange};
}`;
    })
    .join("\n");
}

function isSubsetFile(file: string): boolean {
  return path.resolve(file).startsWith(CACHE_DIR);
}

function isCriticalFile(file: string): boolean {
  return file.endsWith("-home.woff2");
}

function toPosix(file: string): string {
  return file.replaceAll("\\", "/");
}
