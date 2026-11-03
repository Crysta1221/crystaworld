import { publicHttpUrl } from "./blocked-url.ts";
import { fetchLinkPreview } from "./fetch-preview.ts";

const MAX_URL_LENGTH = 2048;

export type LinkPreviewRuntime = {
  /** Keeps a cache write alive after the response has been sent. */
  waitUntil?: (promise: Promise<unknown>) => void;
  /** Dev servers have no page of their own origin to check against. */
  allowCrossOrigin?: boolean;
};

/**
 * GET /api/link-preview?url=https://example.com
 *
 * Only pages of this site may call it, and results are shared through the edge cache,
 * so scripts cannot use the endpoint as an open page fetcher.
 */
export async function linkPreviewResponse(
  request: Request,
  runtime: LinkPreviewRuntime = {},
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return failure(405, "Method not allowed");
  }
  if (!runtime.allowCrossOrigin && !isSameOrigin(request)) return failure(403, "Forbidden");

  const target = new URL(request.url).searchParams.get("url") ?? "";
  const url = target.length <= MAX_URL_LENGTH ? publicHttpUrl(target) : undefined;
  if (!url) return failure(400, "Invalid URL");
  url.hash = "";

  const cache = edgeCache();
  const cacheKey = new Request(`${new URL(request.url).origin}/api/link-preview?url=${encodeURIComponent(url.href)}`);
  const hit = await cache?.match(cacheKey);
  if (hit) return forMethod(request, hit);

  const { preview, ttl } = await fetchLinkPreview(url);
  const response = Response.json(preview, { headers: { "cache-control": `public, max-age=${ttl}` } });
  if (cache && runtime.waitUntil) runtime.waitUntil(cache.put(cacheKey, response.clone()));
  return forMethod(request, response);
}

function failure(status: number, error: string): Response {
  return Response.json({ error }, { status, headers: { "cache-control": "no-store" } });
}

/** HEAD gets the headers of the GET response without its body. */
function forMethod(request: Request, response: Response): Response {
  if (request.method !== "HEAD") return response;
  return new Response(null, { status: response.status, headers: response.headers });
}

/**
 * Browsers label the request, so a fetch from a page of this site says `same-origin`.
 * Older clients fall back to the Origin or Referer host. Requests with neither are refused.
 */
function isSameOrigin(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site) return site === "same-origin";

  const source = request.headers.get("origin") ?? request.headers.get("referer");
  if (!source) return false;
  try {
    return new URL(source).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/** The Workers edge cache. Other runtimes, such as the dev server, have none. */
function edgeCache(): Cache | undefined {
  return (globalThis as { caches?: { default?: Cache } }).caches?.default;
}
