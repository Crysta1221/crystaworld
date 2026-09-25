import { applyOg, resolveOgEntry, type OgManifest } from "../src/og/head.ts";

type AssetFetcher = { fetch: (request: Request) => Promise<Response> };

let manifestTask: Promise<OgManifest | null> | null = null;

/**
 * Crawlers never run the SPA. Swap the head for the route before the HTML leaves the worker.
 */
export async function withOgTags(request: Request, assets: AssetFetcher, response: Response): Promise<Response> {
  if (request.method !== "GET") return response;
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return response;

  const url = new URL(request.url);
  if (url.pathname.startsWith("/admin")) return response;

  const manifest = await loadManifest(assets, url.origin);
  if (!manifest) return response;

  const html = applyOg(await response.text(), resolveOgEntry(manifest, url.pathname), url.href);
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

async function loadManifest(assets: AssetFetcher, origin: string): Promise<OgManifest | null> {
  manifestTask ??= assets
    .fetch(new Request(new URL("/og/manifest.json", origin)))
    .then(async (response) => (response.ok ? ((await response.json()) as OgManifest) : null))
    .catch(() => null);
  const manifest = await manifestTask;
  if (!manifest) manifestTask = null;
  return manifest;
}
