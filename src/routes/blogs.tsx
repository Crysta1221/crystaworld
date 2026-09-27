import { createFileRoute } from "@tanstack/react-router";

import { fetchBlogs } from "@/features/content/content-fns";
import { BlogsPage } from "@/features/blogs";

export const Route = createFileRoute("/blogs")({
  loader: () => fetchBlogs(),
  component: Blogs,
});

function Blogs() {
  const posts = Route.useLoaderData();
  return <BlogsPage posts={posts} />;
}
