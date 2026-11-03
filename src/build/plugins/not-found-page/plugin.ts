import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Switches the deployed Worker config to serve `public/404.html` for unknown paths.
 *
 * `wrangler.jsonc` keeps `not_found_handling: "none"` because prerendering fetches pages that
 * have no file yet, and under `404-page` the asset layer would answer those with the 404 page
 * instead of letting TanStack Start render them. The switch runs after the prerender step.
 * From then on every unknown URL, such as the bot probes for wp-login.php or .env, is answered
 * by the asset layer and never starts the Worker.
 */
export function notFoundPagePlugin(): Plugin {
  return {
    name: "crystaworld:not-found-page",
    enforce: "post",
    buildApp: {
      // TanStack Start prerenders in its own `post` handler, which comes earlier in the plugin list.
      order: "post",
      async handler(builder) {
        const configPath = await deployedConfigPath(builder.config.root);
        const config = JSON.parse(await readFile(configPath, "utf8")) as { assets?: Record<string, unknown> };
        if (!config.assets) throw new Error(`${configPath} has no assets block to switch to the 404 page.`);
        config.assets.not_found_handling = "404-page";
        await writeFile(configPath, JSON.stringify(config));
      },
    },
  };
}

/** The Cloudflare plugin points `.wrangler/deploy/config.json` at the Worker config it generated. */
async function deployedConfigPath(root: string): Promise<string> {
  const redirect = path.join(root, ".wrangler/deploy/config.json");
  const { configPath } = JSON.parse(await readFile(redirect, "utf8")) as { configPath: string };
  return path.resolve(path.dirname(redirect), configPath);
}
