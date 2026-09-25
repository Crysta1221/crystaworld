import { createFileRoute } from "@tanstack/react-router";

import { WorkDetailPage } from "@/features/works";

export const Route = createFileRoute("/works_/$workId")({
  component: WorkDetailRoute,
});

function WorkDetailRoute() {
  const { workId } = Route.useParams();
  return <WorkDetailPage workId={workId} />;
}
