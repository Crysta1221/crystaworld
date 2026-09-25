import { useMemo } from "react";
import { formatYearMonth } from "@/features/locale";
import { ArticleToc, ArticleTocSlide, MarkdownArticle } from "@/shared/components/markdown";
import { extractHeadings } from "@/shared/lib/markdown/extract-headings";
import type { BlogPost } from "./catalog";

interface BlogPostViewProps {
  post: BlogPost;
}

/**
 * Renders an individual blog post with an optional sticky Table of Contents.
 */
export function BlogPostView({ post }: BlogPostViewProps) {
  const headings = useMemo(() => extractHeadings(post.body), [post.body]);
  const hasToc = headings.length > 0;

  return (
    <article>
      <header className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
          {post.title}
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          {formatYearMonth(post.date, "ja")}
        </p>
        {post.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {hasToc ? (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <MarkdownArticle markdown={post.body} />
          </div>
          <aside className="sticky top-24 hidden h-[calc(100dvh-8rem)] flex-col self-start lg:flex">
            <ArticleToc headings={headings} className="h-full" />
          </aside>
          <ArticleTocSlide headings={headings} />
        </div>
      ) : (
        <MarkdownArticle markdown={post.body} />
      )}
    </article>
  );
}
