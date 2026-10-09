const X_HOSTS = new Set(["x.com", "twitter.com"]);
const STATUS_PATH = /^\/(?:[A-Za-z0-9_]{1,15}|i(?:\/web)?)\/status(?:es)?\/(\d{1,25})(?:\/|$)/;

export type XPost = {
  /** Numeric post id, the only thing the embed needs. */
  id: string;
};

/**
 * Reads an X (Twitter) post URL such as https://x.com/user/status/123.
 * Profile pages, searches, and other x.com paths return undefined so they stay ordinary link cards.
 */
export function parseXPostUrl(href: string): XPost | undefined {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;

  const host = url.hostname.toLowerCase().replace(/^(?:www|mobile)\./, "");
  if (!X_HOSTS.has(host)) return undefined;

  const id = STATUS_PATH.exec(url.pathname)?.[1];
  return id ? { id } : undefined;
}
