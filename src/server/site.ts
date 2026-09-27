/**
 * Cloudflare Worker in front of TanStack Start.
 * Prerendered pages and static files are served by the asset layer before this Worker runs.
 * The Worker only sees dynamic endpoints (CMS auth, admin, link previews, server functions)
 * and paths without a matching asset, which fall through to Start SSR.
 */
import startServer from "@tanstack/react-start/server-entry";

import { handleCmsAuth, isCmsAuthPath } from "./cms-auth.ts";
import type { SiteEnv } from "./env.ts";
import { withCriticalHtml } from "./html/critical-html.ts";
import { linkPreviewResponse } from "./link-preview/response.ts";

export default {
  async fetch(request: Request, env: SiteEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/link-preview") return linkPreviewResponse(request);
    if (isCmsAuthPath(url.pathname)) return handleCmsAuth(request, env);
    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      url.pathname = "/admin/";
      return env.ASSETS.fetch(new Request(url, request));
    }
    return withCriticalHtml(await startServer.fetch(request));
  },
};
