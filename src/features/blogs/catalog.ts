import { parseMarkdownFile, splitList } from "@/shared/lib/markdown";

export type BlogPost = {
  id: string;
  title: string;
  /** `YYYY-MM` or `YYYY-MM-DD`. Blogs are Japanese only. */
  date: string;
  tags: readonly string[];
  body: string;
};

const REQUIRED_FIELDS = ["title", "date"] as const;

/**
 * Blog posts are Japanese Markdown files under src/contents/blogs.
 * The server bundle owns the file map so article text stays out of the client.
 */
export function loadBlogs(sources: Record<string, string>): readonly BlogPost[] {
  return Object.entries(sources)
    .map(([path, source]) => toPost(path, source))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function toPost(path: string, source: string): BlogPost {
  const fileName = path.split("/").pop() ?? path;
  const id = fileName.replace(/\.md$/, "");
  if (!id || id === fileName) throw new Error(`Unexpected blog file name: ${path}`);

  const { meta, body } = parseMarkdownFile(source, path, REQUIRED_FIELDS);

  return {
    id,
    title: meta.title ?? id,
    date: meta.date ?? "",
    tags: splitList(meta.tags ?? ""),
    body,
  };
}
