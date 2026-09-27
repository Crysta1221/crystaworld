import { useEffect } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { BlogPostView } from "@/features/blogs/blog-post-view";
import { Button } from "@/shared/components/ui/button";
import type { HighlightBlock } from "@/shared/lib/highlighting/highlight-context";

import type { MemoPost } from "./catalog";

/**
 * Memo detail. Shares the article layout with blogs, including the table of contents.
 */
export function MemoDetailPage({
  post,
  highlights = {},
}: {
  post: MemoPost | null;
  highlights?: Readonly<Record<string, HighlightBlock>>;
}) {

  useEffect(() => {
    document.title = post ? `${post.title} | Crystaworld` : "Crystaworld";
    return () => {
      document.title = "Crystaworld";
    };
  }, [post]);

  return (
    <div className="py-6 sm:py-8">
      <div className="slide-enter">
        <Button
          variant="secondary"
          size="sm"
          className="h-auto px-5 py-2"
          nativeButton={false}
          render={<Link to="/memos" />}
        >
          <ArrowLeftIcon />
          戻る
        </Button>
      </div>

      {post ? (
        <div className="mt-6 sm:mt-8">
          <BlogPostView post={post} highlights={highlights} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">このメモは見つかりませんでした。</p>
      )}
    </div>
  );
}
