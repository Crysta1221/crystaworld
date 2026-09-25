import { useMemo, useState, type ReactNode } from "react";

import { collectTags, filterPosts, type IndexPost } from "./filter-posts";
import type { PostFilter } from "./post-filter-dialog";
import { PostIndexToolbar } from "./post-index-toolbar";

type PostIndexProps<T extends IndexPost> = {
  posts: readonly T[];
  emptyMessage: string;
  renderPost: (post: T) => ReactNode;
};

/**
 * Searchable, filterable grid of post cards. Three columns from the `lg` breakpoint.
 */
export function PostIndex<T extends IndexPost>({ posts, emptyMessage, renderPost }: PostIndexProps<T>) {
  const [filter, setFilter] = useState<PostFilter>({ keyword: "", tags: [], sort: "newest" });
  const tags = useMemo(() => collectTags(posts), [posts]);
  const visible = useMemo(
    () => filterPosts(posts, filter.keyword, filter.tags, filter.sort),
    [posts, filter],
  );

  return (
    <div className="space-y-4">
      <PostIndexToolbar
        query={filter.keyword}
        onQueryChange={(keyword) => setFilter((current) => ({ ...current, keyword }))}
        filter={filter}
        onFilterApply={setFilter}
        tags={tags}
      />
      {posts.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{emptyMessage}</p>
      ) : visible.length === 0 ? (
        <p className="text-sm leading-relaxed text-muted-foreground">一致するものはありません。</p>
      ) : (
        <ul className="grid list-none grid-cols-1 items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.id} className="min-w-0">
              {renderPost(post)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
