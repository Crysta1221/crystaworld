import { join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin, ViteDevServer } from "vite";

import { applyOg, resolveOgEntry } from "./head";
import { renderOgAssets, type OgAssets } from "./render";

/**
 * Builds Open Graph PNGs from blog Markdown and serves them in dev and production.
 */
export function ogImages(): Plugin {
  let pending: Promise<OgAssets> | null = null;
  let server: ViteDevServer | undefined;

  const ensure = () => {
    pending ??= renderOgAssets();
    return pending;
  };

  return {
    name: "og-images",
    async buildStart() {
      await ensure();
    },
    configureServer(devServer) {
      server = devServer;
      devServer.middlewares.use(async (req, res, next) => {
        try {
          if (!(await serveOg(req, res, ensure))) next();
        } catch (error) {
          next(error);
        }
      });
      for (const folder of ["blogs", "memos"]) {
        devServer.watcher.add(join(process.cwd(), "src/contents", folder));
      }
      devServer.watcher.on("all", (_event, file) => {
        const normalized = file.replaceAll("\\", "/");
        if (!normalized.endsWith(".md")) return;
        if (!normalized.includes("/src/contents/blogs/") && !normalized.includes("/src/contents/memos/")) return;
        pending = null;
        void ensure();
      });
    },
    async transformIndexHtml(html, ctx) {
      if (!server && !ctx.server) return html;
      const assets = await ensure();
      const pathname = pathnameOf(ctx.originalUrl ?? "/");
      const origin = devOrigin(ctx.server ?? server);
      return applyOg(html, resolveOgEntry(assets.manifest, pathname), `${origin}${pathname}`);
    },
    async generateBundle() {
      const assets = await ensure();
      this.emitFile({
        type: "asset",
        fileName: "og/manifest.json",
        source: JSON.stringify(assets.manifest),
      });
      for (const [fileName, source] of assets.images) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}

async function serveOg(
  req: IncomingMessage,
  res: ServerResponse,
  ensure: () => Promise<OgAssets>,
): Promise<boolean> {
  const pathname = pathnameOf(req.url ?? "/");
  if (pathname !== "/og/manifest.json" && !pathname.startsWith("/og/")) return false;
  const assets = await ensure();
  if (pathname === "/og/manifest.json") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(assets.manifest));
    return true;
  }
  const image = assets.images.get(pathname.slice(1));
  if (!image) return false;
  res.statusCode = 200;
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "no-cache");
  res.end(image);
  return true;
}

function pathnameOf(url: string): string {
  const end = url.indexOf("?");
  return end === -1 ? url : url.slice(0, end);
}

function devOrigin(devServer: ViteDevServer | undefined): string {
  const local = devServer?.resolvedUrls?.local?.[0];
  if (local) return new URL(local).origin;
  return "http://localhost:3000";
}
