import type { Plugin } from "vite";

import { devMiddlewarePlugin } from "./dev-middleware/plugin.ts";
import { zenMaruFontsPlugin } from "./fonts/plugin.ts";
import { codeHighlightsPlugin } from "./highlights/plugin.ts";
import { notFoundPagePlugin } from "./not-found-page/plugin.ts";
import { ogImagesPlugin } from "./og/plugin.ts";

/** Site-specific Vite plugins: font subsets, code highlights, Open Graph images, the 404 page switch, and dev-only endpoints. */
export function sitePlugins(): Plugin[] {
  return [zenMaruFontsPlugin(), codeHighlightsPlugin(), ogImagesPlugin(), notFoundPagePlugin(), devMiddlewarePlugin()];
}
