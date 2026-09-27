import { createFileRoute } from "@tanstack/react-router";

import { articleMeta } from "@/features/articles/article-head";
import { fetchMemo } from "@/features/articles/server-fns";
import { MemoDetailPage } from "@/features/memos";

export const Route = createFileRoute("/memos_/$memoId")({
  loader: ({ params }) => fetchMemo({ data: params.memoId }),
  head: ({ loaderData }) =>
    loaderData
      ? articleMeta({
          title: loaderData.post.title,
          body: loaderData.post.body,
          path: `/memos/${loaderData.post.id}`,
          imagePath: `/og/memos/${loaderData.post.id}.png`,
        })
      : { meta: [{ title: "Crystaworld" }] },
  component: MemoDetailRoute,
});

function MemoDetailRoute() {
  const article = Route.useLoaderData();
  return <MemoDetailPage post={article?.post ?? null} highlights={article?.highlights} />;
}
