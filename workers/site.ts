/**
 * Cloudflare Worker in front of TanStack Start.
 * Page routes stay in src/routes. This file only serves what the app router should not own:
 * CMS auth, the admin HTML, link previews, and crawler Open Graph tags.
 */
import startServer from "@tanstack/react-start/server-entry";

import { handleCmsAuth, isCmsAuthPath } from "./cms-auth.ts";
import { linkPreviewResponse } from "./link-preview/response.ts";
import { withOgTags } from "./og/html.ts";

type SiteEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ALLOWED_DOMAINS?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_HOSTNAME?: string;
  GITLAB_CLIENT_ID?: string;
  GITLAB_CLIENT_SECRET?: string;
  GITLAB_HOSTNAME?: string;
};

export default {
  async fetch(request: Request, env: SiteEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/link-preview") return linkPreviewResponse(request);
    if (isCmsAuthPath(url.pathname)) return handleCmsAuth(request, env);
    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      url.pathname = "/admin/";
      return env.ASSETS.fetch(new Request(url, request));
    }
    // Page routes share prefixes with images (`/works/*.webp`). Files stay on the asset server.
    if (isStaticAssetPath(url.pathname)) return env.ASSETS.fetch(request);
    const response = await startServer.fetch(request);
    return withOgTags(request, env.ASSETS, response);
  },
};

function isStaticAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/_serverFn")) return false;
  const file = pathname.split("/").pop() ?? "";
  return file.includes(".");
}
