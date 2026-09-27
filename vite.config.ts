import { defineConfig, lazyPlugins } from "vite-plus";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { redact } from "@tanstack/redact/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sitePlugins } from "./src/build/plugins/index.ts";
import { prerenderPages } from "./src/build/prerender-pages.ts";

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
      server: {
        build: {
          inlineCss: true,
        },
      },
      prerender: {
        enabled: true,
        crawlLinks: false,
        autoStaticPathsDiscovery: true,
        // `/works` -> works.html so the asset layer serves it without a trailing-slash redirect.
        autoSubfolderIndex: false,
        failOnError: true,
        filter: ({ path }) => path !== "/cms-preview",
      },
      pages: prerenderPages(),
    }),
    tailwindcss(),
    viteReact(),
    ...sitePlugins(),
  ]),
});

export default config;
