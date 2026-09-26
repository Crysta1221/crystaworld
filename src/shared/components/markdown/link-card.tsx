import { useEffect, useState } from "react";

import { loadLinkPreview } from "@/shared/lib/link-preview/client";
import type { LinkPreview } from "@/shared/lib/link-preview/types";

/**
 * Bookmark card for a link that sits on its own line.
 * Title, description, and image come from the page's Open Graph tags.
 */
export function LinkCard({ href, fallbackTitle }: { href: string; fallbackTitle: string }) {
  const [preview, setPreview] = useState<LinkPreview | undefined>();
  const [imageOk, setImageOk] = useState(true);

  useEffect(() => {
    let active = true;
    setPreview(undefined);
    setImageOk(true);
    loadLinkPreview(href).then(
      (next) => {
        if (active) setPreview(next);
      },
      () => {
        if (active) setPreview(undefined);
      },
    );
    return () => {
      active = false;
    };
  }, [href]);

  const title = preview?.title || displayTitle(fallbackTitle, href);
  const description = preview?.description ?? "";
  const image = preview && imageOk ? preview.image : "";
  const shownUrl = preview?.url || href;

  return (
    <a className="link-card" href={href} target="_blank" rel="noopener noreferrer">
      <span className="link-card-copy">
        <span className="link-card-title">{title}</span>
        {description ? <span className="link-card-description">{description}</span> : null}
        <span className="link-card-url">{shownUrl}</span>
      </span>
      {image ? (
        <img
          className="link-card-image"
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageOk(false)}
        />
      ) : null}
    </a>
  );
}

function displayTitle(fallback: string, href: string): string {
  const text = fallback.trim();
  if (text && text !== href) return text;
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}
