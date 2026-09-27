import { readdirSync } from "node:fs";

import { defineConfig, lazyPlugins } from "vite-plus";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { redact } from "@tanstack/redact/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import webfontDownload from "vite-plugin-webfont-dl";
import { cmsAdminMiddleware } from "./workers/dev/cms-admin";
import { linkPreviewMiddleware } from "./workers/dev/link-preview";
import { stripModulePreloadPlugin } from "./scripts/strip-modulepreload.ts";
import { zenMaruSubsetPlugin } from "./scripts/subset-fonts.ts";
import { ogImages } from "./workers/og/plugin";

function contentPages(folder: string, prefix: string) {
  return readdirSync(`src/contents/${folder}`)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({ path: `${prefix}/${encodeURIComponent(file.slice(0, -3))}` }));
}

const config = defineConfig({
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts", ".serena/**"],
  },
  lint: {
    ignorePatterns: ["src/routeTree.gen.ts", ".serena/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }, "oxlint-tailwindcss"],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "tailwindcss/enforce-canonical": "warn",
    },
    settings: {
      tailwindcss: {
        entryPoint: "src/app/styles.css",
      },
    },
    options: { typeAware: true, typeCheck: true },
  },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(() => [
    redact({ preset: "full" }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      srcDirectory: "src",
      // The published router input type omits this flag; the plugin still honors it.
      router: {
        autoCodeSplitting: true,
      } as NonNullable<Parameters<typeof tanstackStart>[0]>["router"],
      server: {
        build: {
          inlineCss: true,
        },
      },
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: true,
        failOnError: true,
        filter: ({ path }) => path !== "/cms-preview",
      },
      pages: [
        { path: "/" },
        { path: "/works" },
        { path: "/blogs" },
        { path: "/memos" },
        ...contentPages("works", "/works"),
        ...contentPages("blogs", "/blogs"),
        ...contentPages("memos", "/memos"),
      ],
    }),
    tailwindcss(),
    viteReact(),
    // Self-host the Google Fonts declared in index.html at build time.
    webfontDownload(undefined, { subsetsAllowed: ["latin"] }),
    zenMaruSubsetPlugin(),
    ogImages(),
    stripModulePreloadPlugin(),
    {
      name: "cms-admin",
      configureServer(server) {
        return () => {
          server.middlewares.stack.unshift(
            { route: "", handle: cmsAdminMiddleware() },
            { route: "", handle: linkPreviewMiddleware() },
          );
        };
      },
      configurePreviewServer(server) {
        return () => {
          server.middlewares.stack.unshift(
            { route: "", handle: cmsAdminMiddleware() },
            { route: "", handle: linkPreviewMiddleware() },
          );
        };
      },
    },
  ]),
});

export default config;
