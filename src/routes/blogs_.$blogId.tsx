import { createFileRoute } from "@tanstack/react-router";

import { BlogDetailPage } from "@/features/blogs";
import { articleMeta } from "@/features/content/article-head";
import { fetchBlog } from "@/features/content/content-fns";

export const Route = createFileRoute("/blogs_/$blogId")({
  loader: ({ params }) => fetchBlog({ data: params.blogId }),
  head: ({ loaderData }) =>
    loaderData
      ? articleMeta({
          title: loaderData.post.title,
          body: loaderData.post.body,
          imagePath: `/og/blogs/${loaderData.post.id}.png`,
        })
      : { meta: [{ title: "Crystaworld" }] },
  component: BlogDetailRoute,
});

function BlogDetailRoute() {
  const article = Route.useLoaderData();
  return <BlogDetailPage post={article?.post ?? null} highlights={article?.highlights} />;
}
