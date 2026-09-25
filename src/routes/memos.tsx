import { createFileRoute } from "@tanstack/react-router";

import { MemosPage } from "@/features/memos";

export const Route = createFileRoute("/memos")({
  component: Memos,
});

function Memos() {
  return <MemosPage />;
}
