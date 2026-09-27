export type ParsedDocument = {
  title: string;
  description: string;
  image: string;
  siteName: string;
};

const META_TAG = /<meta\s+[^>]*>/gi;
const TITLE_TAG = /<title[^>]*>([\s\S]*?)<\/title>/i;

/**
 * Reads Open Graph, Twitter, and document title fields from an HTML head.
 */
export function parseDocument(html: string, pageUrl: string): ParsedDocument {
  const meta = readMeta(html);
  const title = firstText(meta.get("og:title"), meta.get("twitter:title"), readTitle(html));
  const description = firstText(
    meta.get("og:description"),
    meta.get("twitter:description"),
    meta.get("description"),
  );
  const image = absoluteHttp(pageUrl, firstText(meta.get("og:image"), meta.get("twitter:image")));
  const siteName = firstText(meta.get("og:site_name"));
  return { title, description, image, siteName };
}

function readMeta(html: string): Map<string, string> {
  const meta = new Map<string, string>();
  for (const tag of html.match(META_TAG) ?? []) {
    const key = (attr(tag, "property") || attr(tag, "name") || "").toLowerCase();
    const content = decodeEntities(attr(tag, "content") ?? "").trim();
    if (!key || !content || meta.has(key)) continue;
    meta.set(key, content);
  }
  return meta;
}

function readTitle(html: string): string {
  const text = TITLE_TAG.exec(html)?.[1] ?? "";
  return decodeEntities(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function attr(tag: string, name: string): string | undefined {
  const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i").exec(tag);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function firstText(...values: (string | undefined)[]): string {
  for (const value of values) {
    const text = value?.replace(/\s+/g, " ").trim();
    if (text) return text;
  }
  return "";
}

function absoluteHttp(base: string, value: string): string {
  if (!value || value.startsWith("data:")) return "";
  try {
    const url = new URL(value, base);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.href;
  } catch {
    return "";
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => fromCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => fromCode(Number.parseInt(num, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function fromCode(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  return String.fromCodePoint(code);
}
