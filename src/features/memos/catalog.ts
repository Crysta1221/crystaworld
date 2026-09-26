import { parseMarkdownFile, splitList } from "@/shared/lib/markdown";

export type MemoPost = {
  id: string;
  title: string;
  /** `YYYY-MM` or `YYYY-MM-DD`. Memos are Japanese only. */
  date: string;
  tags: readonly string[];
  body: string;
};

const sources = import.meta.glob("/src/contents/memos/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const REQUIRED_FIELDS = ["title", "date"] as const;

/**
 * Memos are Japanese Markdown files under src/contents/memos.
 */
export const MEMOS = loadMemos();

export function getMemo(id: string): MemoPost | undefined {
  return MEMOS.find((post) => post.id === id);
}

function loadMemos(): readonly MemoPost[] {
  return Object.entries(sources)
    .map(([path, source]) => toPost(path, source))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function toPost(path: string, source: string): MemoPost {
  const fileName = path.split("/").pop() ?? path;
  const id = fileName.replace(/\.md$/, "");
  if (!id || id === fileName) throw new Error(`Unexpected memo file name: ${path}`);

  const { meta, body } = parseMarkdownFile(source, path, REQUIRED_FIELDS);

  return {
    id,
    title: meta.title ?? id,
    date: meta.date ?? "",
    tags: splitList(meta.tags ?? ""),
    body,
  };
}
