import { renderToString } from "react-dom/server";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";

import { BLOGS } from "@/features/blogs/catalog";
import { MEMOS } from "@/features/memos/catalog";
import { WORKS } from "@/features/works/catalog";

import { AppProviders } from "./providers";
import { routeTree } from "../routeTree.gen";

/**
 * Paths baked into static HTML. The homepage is what PageSpeed measures;
 * the other routes keep a direct visit from flashing the homepage shell.
 */
export function prerenderPaths(): string[] {
  return [
    "/",
    "/works",
    "/blogs",
    "/memos",
    ...WORKS.map((work) => `/works/${work.id}`),
    ...BLOGS.map((post) => `/blogs/${post.id}`),
    ...MEMOS.map((post) => `/memos/${post.id}`),
  ];
}

export async function render(url: string): Promise<string> {
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [url] }),
    scrollRestoration: false,
  });
  await router.load();

  return renderToString(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  );
}
