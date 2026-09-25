import { PageHero } from "@/shared/components/page-hero";
import { BLOGS } from "./catalog";
import { BlogPostView } from "./blog-post-view";

/**
 * Blogs index. Posts come from src/contents/blogs.
 */
export function BlogsPage() {
  return (
    <div>
      <div className="slide-enter">
        <PageHero pattern="blueprint" title="BLOGS" />
      </div>
      <div className="flex flex-col gap-10 py-6 sm:py-8">
        {BLOGS.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            記事はまだありません。
          </p>
        ) : (
          BLOGS.map((post) => (
            <BlogPostView key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
