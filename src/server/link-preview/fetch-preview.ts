import { publicHttpUrl } from "./blocked-url.ts";
import { parseDocument } from "./parse-document.ts";
import type { LinkPreview } from "../../shared/lib/link-preview/types.ts";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const SUCCESS_TTL = 12 * 60 * 60;
const FAILURE_TTL = 5 * 60;
const HTML_LIMIT = 480_000;
// One Worker instance keeps this many previews; the oldest go first.
const MEMORY_LIMIT = 500;

export type PreviewResult = {
  preview: LinkPreview;
  /** Seconds the result may be cached. Failures are kept for a short time only. */
  ttl: number;
};

const memory = new Map<string, { expires: number; result: PreviewResult }>();

/**
 * Loads Open Graph fields for a public page. The caller passes a URL that already
 * went through `publicHttpUrl`. An unreachable page gets a title-only preview.
 */
export async function fetchLinkPreview(input: URL): Promise<PreviewResult> {
  const url = new URL(input);
  url.hash = "";
  const key = url.href;

  const cached = memory.get(key);
  if (cached && cached.expires > Date.now()) return cached.result;

  let result: PreviewResult;
  try {
    result = { preview: await load(url), ttl: SUCCESS_TTL };
  } catch {
    result = { preview: fallbackPreview(url), ttl: FAILURE_TTL };
  }

  memory.delete(key);
  memory.set(key, { result, expires: Date.now() + result.ttl * 1000 });
  if (memory.size > MEMORY_LIMIT) {
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
  return result;
}

async function load(url: URL): Promise<LinkPreview> {
  const response = await fetchPublic(url);
  if (!response) throw new Error("Link preview page is not reachable");

  const finalUrl = publicHttpUrl(response.url) ?? url;
  const html = await readHtml(response);
  const parsed = parseDocument(html, finalUrl.href);
  const title = clip(parsed.title || fallbackTitle(finalUrl), 180);
  return {
    url: finalUrl.href,
    title,
    description: clip(parsed.description, 280),
    image: parsed.image,
    siteName: clip(parsed.siteName, 80),
  };
}

async function fetchPublic(initial: URL): Promise<Response | undefined> {
  let current = initial;
  for (let hop = 0; hop < 4; hop += 1) {
    if (!publicHttpUrl(current.href)) return undefined;
    const response = await fetch(current, {
      redirect: "manual",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "accept-language": "ja,en;q=0.8",
        "user-agent": USER_AGENT,
      },
      signal: AbortSignal.timeout(6000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return undefined;
      current = new URL(location, current);
      continue;
    }
    if (!response.ok) return undefined;
    return response;
  }
  return undefined;
}

async function readHtml(response: Response): Promise<string> {
  const type = response.headers.get("content-type") ?? "";
  if (type && !type.includes("html") && !type.includes("xml")) return "";
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let html = "";
  while (html.length < HTML_LIMIT) {
    const { done, value } = await reader.read();
    if (done) {
      html += decoder.decode();
      break;
    }
    if (value) html += decoder.decode(value, { stream: true });
    if (html.toLowerCase().includes("</head>")) break;
  }
  await reader.cancel().catch(() => undefined);
  return html;
}

function fallbackPreview(url: URL): LinkPreview {
  return {
    url: url.href,
    title: fallbackTitle(url),
    description: "",
    image: "",
    siteName: "",
  };
}

function fallbackTitle(url: URL): string {
  return url.hostname.replace(/^www\./, "");
}

function clip(value: string, max: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
