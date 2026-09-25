import { Link } from "@tanstack/react-router";

import { PostMediaCard } from "@/shared/components/post-media-card";

import type { MemoPost } from "./catalog";

/**
 * Memo index card. The picture is the note's Open Graph image.
 */
export function MemoCard({ post }: { post: MemoPost }) {
  return (
    <Link
      to="/memos/$memoId"
      params={{ memoId: post.id }}
      className="group flex h-full flex-col rounded-2xl bg-muted p-2.5 outline-none transition-colors hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_4%)] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <PostMediaCard
        imageSrc={`/og/memos/${post.id}.png`}
        title={post.title}
        date={post.date}
        tags={post.tags}
        body={post.body}
      />
    </Link>
  );
}
