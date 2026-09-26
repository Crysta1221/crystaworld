import { useState, type ImgHTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

type ContentImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src: string;
  alt?: string;
  /** Reserves the frame while the file is still downloading. */
  pendingClassName?: string;
  /** The largest image on the page. Loaded immediately; everything else waits. */
  priority?: boolean;
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
  onLoad,
  onError,
  ...props
}: ContentImageProps) {
  const [seen, setSeen] = useState(src);
  const [ready, setReady] = useState(false);
  if (src !== seen) {
    setSeen(src);
    setReady(false);
  }

  return (
    <span className={cn("relative block overflow-hidden", pendingClassName)}>
      {ready ? null : (
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-foreground/10 motion-safe:animate-pulse" />
      )}
      <img
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
    </span>
  );
}
