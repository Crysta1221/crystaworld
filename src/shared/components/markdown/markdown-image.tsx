import type { ComponentProps } from "react";

import { ContentImage } from "@/shared/components/media/content-image";
import { imageSize } from "@/shared/lib/images/sizes";

type MarkdownImageProps = ComponentProps<"img"> & { node?: unknown };

/**
 * A Markdown image title is shown as a small centered caption under the picture.
 */
export function MarkdownImage({ alt, title, node: _node, src, ...props }: MarkdownImageProps) {
  if (!src) return null;

  const size = imageSize(src);
  const image = (
    <ContentImage
      {...props}
      src={src}
      alt={alt ?? ""}
      width={size?.width}
      height={size?.height}
      deferUntilVisible
      pendingClassName="w-full"
      className="h-auto w-full max-w-full rounded-none shadow-xs"
    />
  );

  if (!title) return <span className="my-6 block">{image}</span>;

  return (
    <figure className="my-6 flex w-full max-w-full flex-col items-center">
      {image}
      <figcaption className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">{title}</figcaption>
    </figure>
  );
}
