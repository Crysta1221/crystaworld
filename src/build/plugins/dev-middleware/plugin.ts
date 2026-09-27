import type { Connect, Plugin } from "vite";

import { cmsAdminMiddleware } from "./cms-admin.ts";
import { linkPreviewMiddleware } from "./link-preview.ts";

/**
 * Dev and preview only. Production serves the same routes from the site Worker.
 * Hooks register middlewares directly, so they run before Vite and TanStack Start.
 */
export function devMiddlewarePlugin(): Plugin {
  const install = (middlewares: Connect.Server) => {
    middlewares.use(cmsAdminMiddleware());
    middlewares.use(linkPreviewMiddleware());
  };

  return {
    name: "crystaworld:dev-middleware",
    configureServer(server) {
      install(server.middlewares);
    },
    configurePreviewServer(server) {
      install(server.middlewares);
    },
  };
}
