import { createFileRoute } from "@tanstack/react-router";

import { CmsPreviewPage } from "@/features/cms-preview";

export const Route = createFileRoute("/cms-preview")({
  component: CmsPreviewPage,
});
