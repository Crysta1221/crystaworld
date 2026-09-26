import { useState, type ComponentProps, type ReactElement, type ReactNode } from "react";

import { faviconUrl } from "@/shared/lib/link-preview/favicon";

import { LinkCard } from "./link-card";

type AnchorProps = ComponentProps<"a"> & { node?: unknown };

/**
 * External links show the site icon before the label.
 * A paragraph that is only a link is rendered by MarkdownParagraph as a card.
 */
export function MarkdownAnchor({ href, children, node: _node, className, ...props }: AnchorProps) {
  const external = href?.startsWith("http://") || href?.startsWith("https://");
  const icon = external && href ? faviconUrl(href) : undefined;
  const [iconOk, setIconOk] = useState(true);

  if (!external || !icon || !iconOk) {
    return (
      <a
        href={href}
        className={className}
        {...props}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      {...props}
      className={className ? `link-with-icon ${className}` : "link-with-icon"}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        className="link-with-icon-mark"
        src={icon}
        alt=""
        width={16}
        height={16}
        decoding="async"
        onError={() => setIconOk(false)}
      />
      {children}
    </a>
  );
}

type ParagraphProps = ComponentProps<"p"> & {
  node?: unknown;
  "data-link-card"?: string;
};

export function MarkdownParagraph({ children, node: _node, ...props }: ParagraphProps) {
  const href = props["data-link-card"];
  if (href) return <LinkCard href={href} fallbackTitle={nodeText(children)} />;
  return <p {...props}>{children}</p>;
}

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (!isElement(node)) return "";
  return nodeText(node.props.children);
}

function isElement(node: ReactNode): node is ReactElement<{ children?: ReactNode }> {
  return typeof node === "object" && node !== null && "props" in node;
}
