import { useEffect, useRef, useState } from "react";

import { parseXPostUrl } from "@/shared/lib/x-embed/post-url";
import { loadWidgets } from "@/shared/lib/x-embed/widgets";

type Status = "loading" | "ready" | "failed";

/**
 * An X post that sits on its own line, shown with X's official embed.
 * The prerendered page and any failure (blocked script, deleted post) keep a plain link card,
 * and widgets.js is only requested once the post is close to the viewport.
 */
export function XPostEmbed({ href }: { href: string }) {
  const post = parseXPostUrl(href);
  const frameRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [status, setStatus] = useState<Status>("loading");
  const dark = useDocumentDark();
  const postId = post?.id;

  useEffect(() => {
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!near || !host || !postId) return;

    let cancelled = false;
    loadWidgets()
      .then((twttr) =>
        twttr.widgets.createTweet(postId, host, {
          theme: dark ? "dark" : "light",
          lang: "ja",
          dnt: true,
          conversation: "none",
          align: "center",
        }),
      )
      .then((element) => {
        if (!cancelled) setStatus(element ? "ready" : "failed");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [near, postId, dark]);

  return (
    <div ref={frameRef} className="x-embed">
      {/* widgets.js owns everything inside this node; React never renders children into it. */}
      <div ref={hostRef} className="x-embed-host" />
      {status === "ready" ? null : (
        <a className="link-card" href={href} target="_blank" rel="noopener noreferrer">
          <span className="link-card-copy">
            <span className="link-card-title">X のポストを開く</span>
            <span className="link-card-url">{href}</span>
          </span>
        </a>
      )}
    </div>
  );
}

/** Follows the `dark` class the theme provider keeps on <html>. */
function useDocumentDark(): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setDark(root.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}
