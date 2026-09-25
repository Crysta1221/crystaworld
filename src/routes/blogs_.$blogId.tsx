import { createFileRoute } from "@tanstack/react-router";

import { BlogDetailPage } from "@/features/blogs";

export const Route = createFileRoute("/blogs_/$blogId")({
  component: BlogDetailRoute,
});

function BlogDetailRoute() {
  const { blogId } = Route.useParams();
  return <BlogDetailPage blogId={blogId} />;
}
