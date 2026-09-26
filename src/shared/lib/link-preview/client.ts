import type { LinkPreview } from "./types.ts";

const cache = new Map<string, Promise<LinkPreview>>();

export function loadLinkPreview(url: string): Promise<LinkPreview> {
  const hit = cache.get(url);
  if (hit) return hit;

  const task = fetch(`/api/link-preview?url=${encodeURIComponent(url)}`, {
    headers: { accept: "application/json" },
  }).then(async (response) => {
    if (!response.ok) throw new Error("Link preview failed");
    return readPreview(await response.json());
  });

  cache.set(url, task);
  task.catch(() => {
    cache.delete(url);
  });
  return task;
}

function readPreview(value: unknown): LinkPreview {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    url: text(record.url),
    title: text(record.title),
    description: text(record.description),
    image: text(record.image),
    siteName: text(record.siteName),
  };
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}
