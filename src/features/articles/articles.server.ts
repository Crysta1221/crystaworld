import { loadBlogs, type BlogPost } from "@/features/blogs/catalog";
import { loadMemos, type MemoPost } from "@/features/memos/catalog";
import { loadWorks, type Work } from "@/features/works/catalog";
import codeHighlights from "virtual:crystaworld/code-highlights";

import { pickHighlights } from "@/shared/lib/highlighting/fences";
import type { HighlightBlock } from "@/shared/lib/highlighting/highlight-context";

export type { HighlightBlock };

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

// Drafts show up in `vp dev` for preview and never reach a production build.
const INCLUDE_DRAFTS = import.meta.env.DEV;

// Parsing every Markdown file is the same work on each call, so one Worker instance does it once.
let blogs: readonly BlogPost[] | undefined;
let memos: readonly MemoPost[] | undefined;
let works: readonly Work[] | undefined;

export function listBlogs(): readonly BlogPost[] {
  return (blogs ??= loadBlogs(blogSources, INCLUDE_DRAFTS));
}

export function listMemos(): readonly MemoPost[] {
  return (memos ??= loadMemos(memoSources, INCLUDE_DRAFTS));
}

function allWorks(): readonly Work[] {
  return (works ??= loadWorks(workSources, INCLUDE_DRAFTS));
}

export function listWorks(): readonly Work[] {
  return allWorks().map((work) => ({ ...work, body: "" }));
}

export function readBlog(id: string): ArticleRecord<BlogPost> | null {
  const post = listBlogs().find((item) => item.id === id);
  if (!post) return null;
  return { post, highlights: highlightBody(post.body) };
}

export function readMemo(id: string): ArticleRecord<MemoPost> | null {
  const post = listMemos().find((item) => item.id === id);
  if (!post) return null;
  return { post, highlights: highlightBody(post.body) };
}

export function readWork(id: string): ArticleRecord<Work> | null {
  const work = allWorks().find((item) => item.id === id);
  if (!work) return null;
  return { post: work, highlights: highlightBody(work.body) };
}

type ArticleRecord<T> = {
  post: T;
  highlights: Record<string, HighlightBlock>;
};

function highlightBody(body: string): Record<string, HighlightBlock> {
  return pickHighlights(body, codeHighlights);
}
