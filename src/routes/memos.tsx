import { createFileRoute } from "@tanstack/react-router";

import { fetchMemos } from "@/features/articles/server-fns";
import { MemosPage } from "@/features/memos";

export const Route = createFileRoute("/memos")({
  loader: () => fetchMemos(),
  component: Memos,
});

function Memos() {
  const posts = Route.useLoaderData();
  return <MemosPage posts={posts} />;
}
