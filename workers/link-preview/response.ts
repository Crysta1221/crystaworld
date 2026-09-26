import { fetchLinkPreview } from "./fetch-preview.ts";

const HEADERS = {
  "cache-control": "public, max-age=86400",
  "content-type": "application/json; charset=utf-8",
};

/**
 * GET /api/link-preview?url=https://example.com
 */
export async function linkPreviewResponse(request: Request): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: { "cache-control": "no-store" } });
  }

  const target = new URL(request.url).searchParams.get("url") ?? "";
  const preview = await fetchLinkPreview(target);
  if (!preview) {
    return Response.json({ error: "Invalid URL" }, { status: 400, headers: { "cache-control": "no-store" } });
  }

  if (request.method === "HEAD") return new Response(null, { status: 200, headers: HEADERS });
  return Response.json(preview, { headers: HEADERS });
}
