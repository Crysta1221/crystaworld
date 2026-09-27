import type { Plugin } from "vite";

import { devMiddlewarePlugin } from "./dev-middleware/plugin.ts";
import { zenMaruFontsPlugin } from "./fonts/plugin.ts";
import { ogImagesPlugin } from "./og/plugin.ts";

/** Site-specific Vite plugins: font subsets, Open Graph images, and dev-only endpoints. */
export function sitePlugins(): Plugin[] {
  return [zenMaruFontsPlugin(), ogImagesPlugin(), devMiddlewarePlugin()];
}
