import { parseMarkdownFile, splitList } from "@/shared/lib/markdown";

export type WorkLink = {
  label: string;
  url: string;
};

export type Work = {
  id: string;
  title: string;
  category: string;
  /** `YYYY-MM`. Works are Japanese only, so the page formats this in Japanese. */
  date: string;
  image: string;
  images: readonly string[];
  links: readonly WorkLink[];
  tags: readonly string[];
  body: string;
};

const sources = import.meta.glob("/src/contents/works/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const REQUIRED_FIELDS = ["title", "category", "date", "image", "tags"] as const;

/**
 * Works are authored as Japanese Markdown under src/contents/works.
 * Frontmatter drives the card; the body is the detail.
 */
export const WORKS = loadWorks();

export function getWork(id: string): Work | undefined {
  return WORKS.find((work) => work.id === id);
}

function loadWorks(): readonly Work[] {
  return Object.entries(sources)
    .map(([path, source]) => toWork(path, source))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function toWork(path: string, source: string): Work {
  const fileName = path.split("/").pop() ?? path;
  const id = fileName.replace(/\.md$/, "");
  if (!id || id === fileName) throw new Error(`Unexpected work file name: ${path}`);

  const { meta, records, body } = parseMarkdownFile(source, path, REQUIRED_FIELDS);

  return {
    id,
    title: meta.title ?? id,
    category: meta.category ?? "",
    date: meta.date ?? "",
    image: meta.image ?? "",
    images: splitList(meta.images ?? meta.image ?? ""),
    links: toLinks(records.links ?? [], meta.url ?? ""),
    tags: splitList(meta.tags ?? ""),
    body,
  };
}

function toLinks(records: readonly Record<string, string>[], fallbackUrl: string): WorkLink[] {
  const links = records.flatMap((record) => toLink(record.label ?? "", record.url ?? ""));
  if (links.length > 0) return links;
  return toLink("プロジェクトを見る", fallbackUrl);
}

function toLink(label: string, url: string): WorkLink[] {
  const trimmedLabel = label.trim();
  const trimmedUrl = url.trim();
  if (!trimmedLabel || !isPublicHttpUrl(trimmedUrl)) return [];
  return [{ label: trimmedLabel, url: trimmedUrl }];
}

function isPublicHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
