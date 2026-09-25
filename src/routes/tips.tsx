import { createFileRoute } from "@tanstack/react-router";

import { TipsPage } from "@/features/tips";

export const Route = createFileRoute("/tips")({
  component: Tips,
});

function Tips() {
  return <TipsPage />;
}
