import { LinkSimple } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { scrollToDocumentHash } from "@/shared/lib/markdown/scroll-to-hash";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

export function MarkdownHeading({
  as: Tag,
  children,
  className,
  id,
  node: _node,
  ...props
}: ComponentProps<"h1"> & { as: HeadingTag; node?: unknown; children?: ReactNode }) {
  const Heading = Tag as ElementType;
  const showPermalink = Boolean(id) && id !== "footnote-label";

  return (
    <Heading id={id} className={className} {...props}>
      {showPermalink ? (
        <span className="group/heading inline-flex max-w-full flex-wrap items-baseline">
          {children}
          <Link
            to="."
            hash={id}
            onClick={() => scrollToDocumentHash(id)}
            aria-label="この見出しへのリンク"
            className="ms-1.5 inline-flex size-5 translate-y-px items-center justify-center align-text-bottom text-muted-foreground no-underline opacity-0 transition-opacity hover:text-primary group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 focus-visible:opacity-100"
          >
            <LinkSimple className="size-4" aria-hidden="true" />
          </Link>
        </span>
      ) : (
        children
      )}
    </Heading>
  );
}
