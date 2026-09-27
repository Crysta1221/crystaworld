import type { Plugin } from "vite";

import { renderOgImages, type OgImages } from "./render.tsx";
import { serveOgImage } from "./serve.ts";

const CONTENT_DIRS = ["/src/contents/blogs/", "/src/contents/memos/"];

/**
 * Builds Open Graph images from blog and memo Markdown.
 * Dev serves them from memory; production emits them next to the client assets.
 */
export function ogImagesPlugin(): Plugin {
  let pending: Promise<OgImages> | null = null;
  const images = () => (pending ??= renderOgImages());

  return {
    name: "crystaworld:og-images",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        serveOgImage(req.url ?? "/", res, images).then((served) => {
          if (!served) next();
        }, next);
      });
      server.watcher.on("all", (_event, file) => {
        const normalized = file.replaceAll("\\", "/");
        if (!normalized.endsWith(".md")) return;
        if (!CONTENT_DIRS.some((dir) => normalized.includes(dir))) return;
        pending = null;
      });
    },
    async generateBundle() {
      // Only the client environment ships public files.
      if (this.environment.name !== "client") return;
      for (const [fileName, source] of await images()) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}
