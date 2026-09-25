import { createFileRoute } from "@tanstack/react-router";

import { WorksPage } from "@/features/works";

export const Route = createFileRoute("/works")({
  component: Works,
});

function Works() {
  return <WorksPage />;
}
