import { parseMarkdownFile, splitList } from "@/shared/lib/markdown";

export type BlogPost = {
  id: string;
  title: string;
  /** `YYYY-MM`. Blogs are Japanese only. */
  date: string;
  tags: readonly string[];
  body: string;
};

const sources = import.meta.glob("/src/contents/blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const REQUIRED_FIELDS = ["title", "date"] as const;

/**
 * Blog posts are Japanese Markdown files under src/contents/blogs.
 */
export const BLOGS = loadBlogs();

export function getBlog(id: string): BlogPost | undefined {
  return BLOGS.find((post) => post.id === id);
}

function loadBlogs(): readonly BlogPost[] {
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
