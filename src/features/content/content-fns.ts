import { createServerFn } from "@tanstack/react-start";

import type { BlogPost } from "@/features/blogs/catalog";
import type { MemoPost } from "@/features/memos/catalog";
import type { Work } from "@/features/works/catalog";
import type { HighlightBlock } from "./content.server";

export type ArticlePayload<T> = {
  post: T;
  highlights: Record<string, HighlightBlock>;
};

export const fetchBlogs = createServerFn({ method: "GET" }).handler(async () => {
  const { listBlogs } = await import("./content.server");
  return listBlogs();
});

export const fetchMemos = createServerFn({ method: "GET" }).handler(async () => {
  const { listMemos } = await import("./content.server");
  return listMemos();
});

export const fetchWorks = createServerFn({ method: "GET" }).handler(async () => {
  const { listWorks } = await import("./content.server");
  return listWorks();
});

export const fetchBlog = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<ArticlePayload<BlogPost> | null> => {
    const { readBlog } = await import("./content.server");
    return readBlog(id);
  });

export const fetchMemo = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<ArticlePayload<MemoPost> | null> => {
    const { readMemo } = await import("./content.server");
    return readMemo(id);
  });

export const fetchWork = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }): Promise<ArticlePayload<Work> | null> => {
    const { readWork } = await import("./content.server");
    return readWork(id);
  });
