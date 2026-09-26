import { PageHero } from "@/shared/components/page-hero";
import { PostIndex } from "@/shared/components/post-index/post-index";

import { BlogCard } from "./blog-card";
import { BLOGS } from "./catalog";

/**
 * Blogs index. Cards link to each post; the article itself is a separate page.
 */
export function BlogsPage() {
  return (
    <div>
      <div className="slide-enter">
        <PageHero pattern="blueprint" title="BLOGS" />
      </div>
      <div className="py-6 sm:py-8">
        <PostIndex
          posts={BLOGS}
          emptyMessage="記事はまだありません。"
          renderPost={(post, index) => <BlogCard post={post} priority={index === 0} />}
        />
      </div>
    </div>
  );
}
