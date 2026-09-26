import * as React from "react";
import Markdown, { type Components } from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Link, useRouterState } from "@tanstack/react-router";

import {
  Caution,
  Description,
  Important,
  Note,
  Tip,
  TitleContent,
  WarningAlert,
} from "./markdown-alert";
import { MarkdownHeading } from "./markdown-heading";
import { MarkdownCodeBlock } from "./markdown-code-block";
import { hashFromHref, isSameDocumentHref } from "@/shared/lib/markdown/hash-href";
import { scrollToDocumentHash } from "@/shared/lib/markdown/scroll-to-hash";
import { cn } from "@/shared/lib/utils";

function MarkdownAnchor({
  href,
  children,
  node: _node,
  ...props
}: React.ComponentProps<"a"> & { node?: unknown }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = hashFromHref(href);
  const sameDocument = href ? isSameDocumentHref(href, pathname) : false;

  if (hash && sameDocument) {
    return (
      <Link to="." hash={hash} onClick={() => scrollToDocumentHash(hash)} {...props}>
        {children}
      </Link>
    );
  }

  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      {...props}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

const CALLOUT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|WARN|CAUTION)\][^\S\n]*([^\n]*)/i;

function MarkdownBlockquote({
  children,
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  // GitHub alert syntax: > [!NOTE] or > [!NOTE] Custom title.
  const cleanChildren = React.Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim() !== "",
  );
  const firstChild = cleanChildren[0];

  if (React.isValidElement<{ children?: React.ReactNode }>(firstChild)) {
    const pChildren = React.Children.toArray(firstChild.props.children).filter(
      (child) => typeof child !== "string" || child.trim() !== "",
    );
    const firstText = typeof pChildren[0] === "string" ? pChildren[0] : "";
    const alertMatch = CALLOUT_MARKER.exec(firstText.trimStart());

    if (alertMatch) {
      const type = alertMatch[1]?.toUpperCase() ?? "";
      const inlineTitle = alertMatch[2]?.trim() ?? "";
      const remainingText = firstText.trimStart().slice(alertMatch[0].length).replace(/^\r?\n/, "");
      const restPChildren = remainingText.length > 0 ? [remainingText, ...pChildren.slice(1)] : pChildren.slice(1);
      const lifted = inlineTitle ? { title: inlineTitle, nodes: restPChildren } : liftLeadingStrong(restPChildren);
      const paragraph = lifted.nodes.length > 0 ? React.cloneElement(firstChild, {}, ...lifted.nodes) : null;
      const content = [paragraph, ...cleanChildren.slice(1)].filter((node) => node != null);
      const alert = renderCallout(type, lifted.title, content);
      if (alert) return alert;
    }
  }

  return (
    <blockquote className={cn("my-4 border-l-4 border-primary/60 pl-4 italic text-muted-foreground", className)} {...props}>
      {children}
    </blockquote>
  );
}

function renderCallout(type: string, title: string | undefined, content: React.ReactNode) {
  const alert = { title: title || undefined, children: content };
  switch (type) {
    case "NOTE":
      return <Note {...alert} />;
    case "TIP":
      return <Tip {...alert} />;
    case "IMPORTANT":
      return <Important {...alert} />;
    case "WARNING":
    case "WARN":
      return <WarningAlert {...alert} />;
    case "CAUTION":
      return <Caution {...alert} />;
    default:
      return null;
  }
}

function isStrongElement(
  node: React.ReactNode,
): node is React.ReactElement<{ children?: React.ReactNode }> {
  return React.isValidElement(node) && node.type === "strong";
}

function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!React.isValidElement<{ children?: React.ReactNode }>(node)) return "";
  return React.Children.toArray(node.props.children).map(nodeText).join("");
}

/** A bold first line stands in for the generic label, such as メモ. */
function liftLeadingStrong(nodes: React.ReactNode[]): { title?: string; nodes: React.ReactNode[] } {
  let index = 0;
  while (index < nodes.length) {
    const node = nodes[index];
    if (typeof node !== "string" || node.trim() !== "") break;
    index += 1;
  }

  const head = nodes[index];
  if (!isStrongElement(head)) return { nodes };

  const title = nodeText(head).trim();
  if (!title) return { nodes };

  const rest = nodes.slice(index + 1);
  if (typeof rest[0] === "string") rest[0] = rest[0].replace(/^\s+/, "");
  return {
    title,
    nodes: rest.filter((node) => typeof node !== "string" || node.length > 0),
  };
}

const markdownComponents: Components & Record<string, React.ComponentType<any>> = {
  a: MarkdownAnchor,
  h1: (props) => <MarkdownHeading as="h1" {...props} />,
  h2: (props) => <MarkdownHeading as="h2" {...props} />,
  h3: (props) => <MarkdownHeading as="h3" {...props} />,
  h4: (props) => <MarkdownHeading as="h4" {...props} />,
  pre: MarkdownCodeBlock,
  blockquote: MarkdownBlockquote,
  table({ children, ...props }) {
    return (
      <div className="md-table-scroll my-6 w-full overflow-x-auto">
        <table {...props}>{children}</table>
      </div>
    );
  },
  img({ alt, ...props }) {
    return <img alt={alt ?? ""} className="my-6 rounded-none shadow-xs" {...props} />;
  },
  Note,
  note: Note,
  Warn: WarningAlert,
  warn: WarningAlert,
  Warning: WarningAlert,
  warning: WarningAlert,
  Tip,
  tip: Tip,
  Important,
  important: Important,
  Caution,
  caution: Caution,
  TitleContent,
  titlecontent: TitleContent,
  "title-content": TitleContent,
  Description,
  description: Description,
};

export interface MarkdownArticleProps {
  markdown: string;
  className?: string;
}

/**
 * Main Markdown renderer with GitHub styling, Shiki code highlight, and heading permalinks.
 */
export function MarkdownArticle({ markdown, className }: MarkdownArticleProps) {
  return (
    <div className={cn("wiki-prose", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={markdownComponents}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
