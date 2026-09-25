import { parseMarkdownFile, splitList } from "@/shared/lib/markdown";

export type Work = {
  id: string;
  title: string;
  category: string;
  /** `YYYY-MM`. Works are Japanese only, so the page formats this in Japanese. */
  date: string;
  image: string;
  images: readonly string[];
  url: string;
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
    .sort((a, b) => a.date.localeCompare(b.date));
}

function toWork(path: string, source: string): Work {
  const fileName = path.split("/").pop() ?? path;
  const id = fileName.replace(/\.md$/, "");
  if (!id || id === fileName) throw new Error(`Unexpected work file name: ${path}`);

  const { meta, body } = parseMarkdownFile(source, path, REQUIRED_FIELDS);

  return {
    id,
    title: meta.title ?? id,
    category: meta.category ?? "",
    date: meta.date ?? "",
    image: meta.image ?? "",
    images: splitList(meta.images ?? meta.image ?? ""),
    url: meta.url ?? "",
    tags: splitList(meta.tags ?? ""),
    body,
  };
}
