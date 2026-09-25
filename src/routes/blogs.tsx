import { createFileRoute } from "@tanstack/react-router";

import { BlogsPage } from "@/features/blogs";

export const Route = createFileRoute("/blogs")({
  component: Blogs,
});

function Blogs() {
  return <BlogsPage />;
}
