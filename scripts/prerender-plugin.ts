import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createServer, type Plugin } from "vite";

const ROOT_MARKER = '<div id="root"></div>';

/**
 * Renders each public route into its own HTML file and inlines the stylesheet
 * so the first paint does not wait on JavaScript or a second request.
 */
export function prerenderPlugin(): Plugin {
  return {
    name: "prerender-routes",
    apply: "build",
    async closeBundle() {
      const outDir = path.resolve("dist");
      const templatePath = path.join(outDir, "index.html");
      const template = inlineStylesheet(readFileSync(templatePath, "utf8"), outDir);
      if (!template.includes(ROOT_MARKER)) {
        throw new Error("Prerender could not find the empty #root element");
      }

      const server = await createServer({
        server: { middlewareMode: true, hmr: false },
        appType: "custom",
        logLevel: "error",
        // `vp build` runs with NODE_ENV=production. A shared deps cache would
        // replace the dev JSX runtime with the production stub (`jsxDEV = void 0`).
        cacheDir: path.resolve("node_modules/.vite-prerender"),
        optimizeDeps: { noDiscovery: true },
      });

      try {
        const mod = (await server.ssrLoadModule("/src/app/entry-server.tsx")) as {
          prerenderPaths: () => string[];
          render: (url: string) => Promise<string>;
        };
        for (const route of mod.prerenderPaths()) {
          // renderToString emits image preloads that are not part of the client tree.
          const html = (await mod.render(route)).replace(/<link\b[^>]*>/g, "");
          const page = template.replace(ROOT_MARKER, `<div id="root">${html}</div>`);
          const file =
            route === "/"
              ? templatePath
              : path.join(outDir, ...route.split("/").filter(Boolean), "index.html");
          mkdirSync(path.dirname(file), { recursive: true });
          writeFileSync(file, page);
        }
      } finally {
        await server.close();
      }
    },
  };
}

function inlineStylesheet(html: string, outDir: string): string {
  const match = html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
  if (!match?.[0] || !match[1]) return html;

  const href = match[1];
  const cssPath = path.join(outDir, href.replace(/^\//, ""));
  const base = path.posix.dirname(href);
  const css = readFileSync(cssPath, "utf8")
    .replace(/url\((['"]?)(?!data:|https?:|\/)([^)'"]+)\1\)/g, (_full, quote: string, relative: string) => {
      const absolute = path.posix.normalize(`${base}/${relative}`);
      const rooted = absolute.startsWith("/") ? absolute : `/${absolute}`;
      return `url(${quote}${rooted}${quote})`;
    })
    .replaceAll("</style", "<\\/style");

  return html.replace(match[0], `<style>${css}</style>`);
}
