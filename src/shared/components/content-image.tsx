import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type ContentImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt?: string;
  /** Reserves the frame while the file is still downloading. */
  pendingClassName?: string;
  /** The largest image on the page. Loaded immediately; everything else waits. */
  priority?: boolean;
  /** Omits the request until the frame is near the viewport. */
  deferUntilVisible?: boolean;
};

/**
 * Shows a pulsing frame behind the picture until the file has decoded.
 * The image itself stays visible so the first paint does not wait for JavaScript.
 */
export function ContentImage({
  src,
  alt = "",
  className,
  pendingClassName = "size-full",
  priority = false,
  deferUntilVisible = false,
  onLoad,
  onError,
  width,
  height,
  ...props
}: ContentImageProps) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const [seen, setSeen] = useState(src);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(!deferUntilVisible);
  if (src !== seen) {
    setSeen(src);
    setReady(false);
  }

  useEffect(() => {
    if (!deferUntilVisible || visible) return;
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisible(true);
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [deferUntilVisible, visible]);

  const reserved =
    typeof width === "number" && typeof height === "number"
      ? { aspectRatio: `${width} / ${height}` }
      : undefined;

  return (
    <span
      ref={frameRef}
      className={cn("relative block overflow-hidden", pendingClassName)}
      style={visible ? undefined : reserved}
    >
      {ready ? null : (
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-foreground/10 motion-safe:animate-pulse" />
      )}
      {visible ? (
        <img
          width={width}
          height={height}
          {...props}
          src={src}
          alt={alt}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn("relative", className)}
          ref={(node) => {
            if (node?.complete && node.naturalWidth > 0) setReady(true);
          }}
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth > 0) setReady(true);
            onLoad?.(event);
          }}
          onError={(event) => {
            setReady(true);
            onError?.(event);
          }}
        />
      ) : null}
    </span>
  );
}
