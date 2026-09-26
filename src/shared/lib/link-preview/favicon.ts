/** Browser-cached favicon for a public page, used on inline links. */
export function faviconUrl(pageUrl: string): string | undefined {
  try {
    const url = new URL(pageUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(url.hostname)}`;
  } catch {
    return undefined;
  }
}
