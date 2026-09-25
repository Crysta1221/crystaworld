import { useEffect } from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/components/ui/button";

import { BlogPostView } from "./blog-post-view";
import { getBlog } from "./catalog";

/**
 * Blog detail. No page hero, so the table of contents can stick.
 */
export function BlogDetailPage({ blogId }: { blogId: string }) {
  const post = getBlog(blogId);

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
          <BlogPostView post={post} />
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">この記事は見つかりませんでした。</p>
      )}
    </div>
  );
}
