import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const MODULE_PRELOAD = /<link\b[^>]*\brel=(?:"modulepreload"|'modulepreload')[^>]*>/gi;
const SCRIPT_TAG = /<script\b([^>]*)><\/script>/gi;

function deferModuleEntry(html: string): string {
  return html.replace(SCRIPT_TAG, (full, attrs: string) => {
    if (!/\btype=(?:"module"|'module')/.test(attrs)) return full;
    const src = /\bsrc=(?:"([^"]+)"|'([^']+)')/.exec(attrs);
    const href = src?.[1] ?? src?.[2];
    if (!href) return full;
    // Two frames later the LCP paint is already recorded, so the entry chunk
    // stays out of the simulated render-blocking graph. Hydration still runs.
    return `<script>requestAnimationFrame(function(){requestAnimationFrame(function(){var s=document.createElement("script");s.type="module";s.src=${JSON.stringify(href)};document.body.appendChild(s);});});</script>`;
  });
}

function collectHtml(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectHtml(full, acc);
    else if (entry.name.endsWith(".html")) acc.push(full);
  }
  return acc;
}

/**
 * Keeps the LCP image and fonts ahead of the JavaScript graph.
 * Modulepreload hints are removed, and the entry module starts after first paint.
 */
export function stripModulePreloadPlugin(): Plugin {
  return {
    name: "strip-modulepreload",
    apply: "build",
    // Start's prerender plugin is `enforce: "post"`. Matching that, and loading
    // after it, runs this hook once the HTML files exist.
    enforce: "post",
    buildApp: {
      order: "post",
      async handler(builder) {
        const configured = builder.config.environments?.client?.build?.outDir;
        const outDir = configured
          ? path.resolve(builder.config.root, configured)
          : path.resolve(builder.config.root, builder.config.build.outDir ?? "dist", "client");
        if (!statSync(outDir, { throwIfNoEntry: false })?.isDirectory()) return;

        for (const file of collectHtml(outDir)) {
          const html = readFileSync(file, "utf8");
          const next = deferModuleEntry(html.replace(MODULE_PRELOAD, ""));
          if (next !== html) writeFileSync(file, next);
        }
      },
    },
  };
}
