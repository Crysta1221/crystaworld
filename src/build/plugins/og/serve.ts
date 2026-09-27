import type { ServerResponse } from "node:http";

import type { OgImages } from "./render.tsx";

/** Answers `/og/*` requests in dev. Returns false when the path is not an OG image. */
export async function serveOgImage(
  url: string,
  res: ServerResponse,
  images: () => Promise<OgImages>,
): Promise<boolean> {
  const pathname = pathnameOf(url);
  if (!pathname.startsWith("/og/")) return false;
  const image = (await images()).get(pathname.slice(1));
  if (!image) return false;
  res.statusCode = 200;
  res.setHeader("Content-Type", pathname.endsWith(".webp") ? "image/webp" : "image/png");
  res.setHeader("Cache-Control", "no-cache");
  res.end(image);
  return true;
}

function pathnameOf(url: string): string {
  const path = url.split("?")[0] ?? url;
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}
