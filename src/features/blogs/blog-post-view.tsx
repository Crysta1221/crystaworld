import { useMemo } from "react";
import { formatYearMonth } from "@/features/locale";
import { ArticleToc, MarkdownArticle } from "@/shared/components/markdown";
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
    <article className="border-b border-border/60 pb-12 last:border-b-0">
      <header className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {post.title}
        </h2>
        <p className="text-sm font-medium text-muted-foreground">
          {formatYearMonth(post.date, "ja")}
        </p>
      </header>

      {hasToc ? (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <div className="mb-8 lg:hidden">
              <ArticleToc headings={headings} />
            </div>
            <MarkdownArticle markdown={post.body} />
          </div>
          <aside className="sticky top-24 hidden h-[calc(100dvh-8rem)] flex-col self-start lg:flex">
            <ArticleToc headings={headings} className="h-full" />
          </aside>
        </div>
      ) : (
        <MarkdownArticle markdown={post.body} />
      )}
    </article>
  );
}
