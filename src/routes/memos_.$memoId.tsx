import { createFileRoute } from "@tanstack/react-router";

import { MemoDetailPage } from "@/features/memos";

export const Route = createFileRoute("/memos_/$memoId")({
  component: MemoDetailRoute,
});

function MemoDetailRoute() {
  const { memoId } = Route.useParams();
  return <MemoDetailPage memoId={memoId} />;
}
