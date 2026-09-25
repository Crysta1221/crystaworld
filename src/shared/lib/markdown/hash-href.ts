export function hashFromHref(href: string | undefined): string | undefined {
  if (!href) return undefined;

  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return undefined;

  const raw = href.slice(hashIndex + 1);
  if (!raw) return undefined;

  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function isSameDocumentHref(href: string, pathname: string): boolean {
  if (href.startsWith("#")) return true;

  try {
    const url = new URL(href, "https://crystaworld.local");
    return url.pathname === pathname && url.hash.length > 1;
  } catch {
    return false;
  }
}
