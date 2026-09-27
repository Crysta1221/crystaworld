import { loadBlogs, type BlogPost } from "@/features/blogs/catalog";
import { loadMemos, type MemoPost } from "@/features/memos/catalog";
import { loadWorks, type Work } from "@/features/works/catalog";
import { highlightCode } from "@/shared/lib/highlighting/highlighter";
import { parseCodeMeta } from "@/shared/lib/highlighting/parse-code-meta";
import { parseShikiPre } from "@/shared/lib/highlighting/parse-shiki-pre";

export type HighlightBlock = {
  className: string;
  innerHtml: string;
};

const blogSources = import.meta.glob("/src/contents/blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const memoSources = import.meta.glob("/src/contents/memos/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const workSources = import.meta.glob("/src/contents/works/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const FENCE = /```([^\n]*)\n([\s\S]*?)```/g;

export function listBlogs(): readonly BlogPost[] {
  return loadBlogs(blogSources);
}

export function listMemos(): readonly MemoPost[] {
  return loadMemos(memoSources);
}

export function listWorks(): readonly Work[] {
  return loadWorks(workSources).map((work) => ({ ...work, body: "" }));
}

export async function readBlog(id: string): Promise<ArticleRecord<BlogPost> | null> {
  const post = listBlogs().find((item) => item.id === id);
  if (!post) return null;
  return { post, highlights: await highlightBody(post.body) };
}

export async function readMemo(id: string): Promise<ArticleRecord<MemoPost> | null> {
  const post = listMemos().find((item) => item.id === id);
  if (!post) return null;
  return { post, highlights: await highlightBody(post.body) };
}

export async function readWork(id: string): Promise<ArticleRecord<Work> | null> {
  const work = loadWorks(workSources).find((item) => item.id === id);
  if (!work) return null;
  return { post: work, highlights: await highlightBody(work.body) };
}

type ArticleRecord<T> = {
  post: T;
  highlights: Record<string, HighlightBlock>;
};

async function highlightBody(body: string): Promise<Record<string, HighlightBlock>> {
  const highlights: Record<string, HighlightBlock> = {};
  for (const match of body.matchAll(FENCE)) {
    const info = (match[1] ?? "").trim();
    const code = (match[2] ?? "").replace(/\n$/, "");
    const [languageToken, ...metaParts] = info.split(/\s+/);
    const language = languageToken || undefined;
    const { filename } = parseCodeMeta(metaParts.join(" "));
    const cacheKey = `${language ?? ""}\0${filename ?? ""}\0${code}`;
    if (highlights[cacheKey]) continue;
    const html = await highlightCode(code, language, filename);
    highlights[cacheKey] = parseShikiPre(html);
  }
  return highlights;
}
