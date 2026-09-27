import { createFileRoute, notFound } from "@tanstack/react-router";

import { BlogDetailPage } from "@/features/blogs";
import { articleMeta } from "@/features/articles/article-head";
import { fetchBlog } from "@/features/articles/server-fns";

export const Route = createFileRoute("/blogs_/$blogId")({
  loader: async ({ params }) => {
    const article = await fetchBlog({ data: params.blogId });
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) =>
    loaderData
      ? articleMeta({
          title: loaderData.post.title,
          body: loaderData.post.body,
          path: `/blogs/${loaderData.post.id}`,
          imagePath: `/og/blogs/${loaderData.post.id}.png`,
        })
      : { meta: [{ title: "Crystaworld" }] },
  component: BlogDetailRoute,
});

function BlogDetailRoute() {
  const article = Route.useLoaderData();
  return <BlogDetailPage post={article?.post ?? null} highlights={article?.highlights} />;
}
