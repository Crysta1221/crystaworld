import type { ComponentProps } from "react";

type MarkdownImageProps = ComponentProps<"img"> & { node?: unknown };

/**
 * A Markdown image title is shown as a small centered caption under the picture.
 */
export function MarkdownImage({ alt, title, node: _node, ...props }: MarkdownImageProps) {
  if (!title) {
    return <img alt={alt ?? ""} {...props} className="my-6 rounded-none shadow-xs" />;
  }

  return (
    <figure className="my-6 flex w-fit max-w-full flex-col items-center">
      <img alt={alt ?? ""} {...props} className="max-w-full rounded-none shadow-xs" />
      <figcaption className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">{title}</figcaption>
    </figure>
  );
}
