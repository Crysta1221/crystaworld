export type SortKey = "newest" | "oldest" | "name" | "name-desc";

export type IndexPost = {
  id: string;
  title: string;
  date: string;
  tags: readonly string[];
  body: string;
};

const SORT_KEYS = ["newest", "oldest", "name", "name-desc"] as const;

export function isSortKey(value: unknown): value is SortKey {
  return typeof value === "string" && SORT_KEYS.some((key) => key === value);
}

/** Tags that appear on at least one post, in Japanese dictionary order. */
export function collectTags(posts: readonly IndexPost[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, "ja"));
}

/**
 * Keeps posts whose title or body contains any keyword, and that include every selected tag.
 * An empty keyword leaves that rule unused.
 */
export function filterPosts<T extends IndexPost>(
  posts: readonly T[],
  keyword: string,
  tags: readonly string[],
  sort: SortKey,
): T[] {
  const included = terms(keyword);
  const matched = posts.filter((post) => {
    if (!tags.every((tag) => post.tags.includes(tag))) return false;
    if (included.length === 0) return true;
    const haystack = `${post.title}\n${post.body}`.toLocaleLowerCase();
    return included.some((term) => haystack.includes(term));
  });

  return [...matched].sort((a, b) => comparePosts(a, b, sort));
}

function terms(value: string): string[] {
  return value.trim().toLocaleLowerCase().split(/\s+/).filter((term) => term.length > 0);
}

function comparePosts(a: IndexPost, b: IndexPost, sort: SortKey): number {
  if (sort === "name") return a.title.localeCompare(b.title, "ja");
  if (sort === "name-desc") return b.title.localeCompare(a.title, "ja");
  const byDate = a.date.localeCompare(b.date);
  return sort === "oldest" ? byDate : -byDate;
}
