import { Link } from "@tanstack/react-router";

import { formatYearMonth } from "@/features/locale";

import type { MemoPost } from "./catalog";

/**
 * Text card for the memos index. The full note lives on its own page.
 */
export function MemoCard({ post }: { post: MemoPost }) {
  return (
    <Link
      to="/memos/$memoId"
      params={{ memoId: post.id }}
      className="group flex h-full flex-col rounded-2xl bg-muted p-5 outline-none transition-colors hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_4%)] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <p className="text-sm font-medium text-muted-foreground">{formatYearMonth(post.date, "ja")}</p>
      {post.tags.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-balance text-foreground">{post.title}</h2>
    </Link>
  );
}
