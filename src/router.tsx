import { createRouter } from "@tanstack/react-router";

import { NotFoundPage } from "@/features/not-found";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: false,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingMinMs: 0,
    // Unknown URLs and missing articles render inside the site layout with a 404 status.
    defaultNotFoundComponent: NotFoundPage,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
