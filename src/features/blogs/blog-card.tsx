import { Link } from "@tanstack/react-router";

import { PostMediaCard } from "@/shared/components/post-media-card";

import type { BlogPost } from "./catalog";

/**
 * Blog index card. The picture is the post's Open Graph image.
 */
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blogs/$blogId"
      params={{ blogId: post.id }}
      className="group flex h-full flex-col rounded-2xl bg-muted p-2.5 outline-none transition-colors hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_4%)] focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <PostMediaCard
        imageSrc={`/og/blogs/${post.id}.png`}
        title={post.title}
        date={post.date}
        tags={post.tags}
        body={post.body}
      />
    </Link>
  );
}
