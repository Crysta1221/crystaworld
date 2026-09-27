import { createFileRoute } from "@tanstack/react-router";

import { fetchWorks } from "@/features/content/content-fns";
import { WorksPage } from "@/features/works";

export const Route = createFileRoute("/works")({
  loader: () => fetchWorks(),
  component: Works,
});

function Works() {
  const works = Route.useLoaderData();
  return <WorksPage works={works} />;
}
