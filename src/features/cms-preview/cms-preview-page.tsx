import { useEffect, useState } from "react";

import { CmsPreviewView, isPreviewPayload, type CmsPreviewPayload } from "./cms-preview-view";

/**
 * Renders the CMS draft with the site's own components.
 * The admin preview iframe posts the entry here.
 */
export function CmsPreviewPage() {
  const [payload, setPayload] = useState<CmsPreviewPayload | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPreviewPayload(event.data)) return;
      setPayload(event.data);
    };

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "crystaworld-cms-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!payload) return null;

  return <CmsPreviewView payload={payload} />;
}
