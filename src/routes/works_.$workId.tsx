import { createFileRoute } from "@tanstack/react-router";

import { articleMeta } from "@/features/articles/article-head";
import { fetchWork } from "@/features/articles/server-fns";
import { WorkDetailPage } from "@/features/works";

export const Route = createFileRoute("/works_/$workId")({
  loader: ({ params }) => fetchWork({ data: params.workId }),
  head: ({ loaderData }) =>
    loaderData
      ? articleMeta({
          title: loaderData.post.title,
          body: loaderData.post.body,
          path: `/works/${loaderData.post.id}`,
          imagePath: loaderData.post.image || "/og/default.png",
        })
      : { meta: [{ title: "Crystaworld" }] },
  component: WorkDetailRoute,
});

function WorkDetailRoute() {
  const article = Route.useLoaderData();
  return <WorkDetailPage work={article?.post ?? null} highlights={article?.highlights} />;
}
