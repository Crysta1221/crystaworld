import { PageHero } from "@/shared/components/page-hero";

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
        {BLOGS.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            記事はまだありません。
          </p>
        ) : (
          <ul className="grid list-none items-stretch gap-3 sm:grid-cols-2">
            {BLOGS.map((post) => (
              <li key={post.id} className="min-w-0">
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
