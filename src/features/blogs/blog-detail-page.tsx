import { useEffect } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/components/ui/button";

import type { HighlightBlock } from "@/shared/lib/highlighting/highlight-context";

import { BlogPostView } from "./blog-post-view";
import type { BlogPost } from "./catalog";

/**
 * Blog detail. No page hero, so the table of contents can stick.
 */
export function BlogDetailPage({
  post,
  highlights = {},
}: {
  post: BlogPost | null;
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
          render={<Link to="/blogs" />}
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
        <p className="mt-8 text-sm text-muted-foreground">この記事は見つかりませんでした。</p>
      )}
    </div>
  );
}
