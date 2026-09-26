import { defineConfig, lazyPlugins } from "vite-plus";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import webfontDownload from "vite-plugin-webfont-dl";
import { cmsAdminMiddleware } from "./workers/dev/cms-admin";
import { linkPreviewMiddleware } from "./workers/dev/link-preview";
import { prerenderPlugin } from "./scripts/prerender-plugin.ts";
import { zenMaruSubsetPlugin } from "./scripts/subset-fonts.ts";
import { ogImages } from "./workers/og/plugin";

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
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    tailwindcss(),
    viteReact(),
    // Self-host the Google Fonts declared in index.html at build time.
    webfontDownload(undefined, { subsetsAllowed: ["latin"] }),
    zenMaruSubsetPlugin(),
    // Uses its own dep cache so a production prerender cannot clobber the dev JSX runtime.
    prerenderPlugin(),
    ogImages(),
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
