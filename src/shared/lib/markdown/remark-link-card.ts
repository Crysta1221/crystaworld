import { parseXPostUrl } from "../x-embed/post-url.ts";

type MdNode = {
  type: string;
  url?: string;
  value?: string;
  children?: MdNode[];
  data?: { hProperties?: Record<string, string> };
};

/**
 * A root-level paragraph that is only an http(s) link becomes a link card,
 * or an embedded post when the link points to an X post.
 * Inline links, and links inside lists, stay as text.
 */
export function remarkLinkCard() {
  return (tree: MdNode) => {
    mark(tree);
  };
}

function mark(node: MdNode) {
  for (const child of node.children ?? []) {
    if (child.type === "paragraph" && node.type === "root") {
      const href = loneHttpLink(child);
      if (href) {
        // X posts get an embed; every other link becomes a bookmark card.
        const key = parseXPostUrl(href) ? "data-x-post" : "data-link-card";
        child.data = { hProperties: { [key]: href } };
      }
    }
    mark(child);
  }
}

function loneHttpLink(paragraph: MdNode): string | undefined {
  const children = (paragraph.children ?? []).filter((child) => child.type !== "text" || child.value?.trim());
  const link = children.length === 1 ? children[0] : undefined;
  if (!link || link.type !== "link" || !link.url) return undefined;
  if (isImageOnly(link)) return undefined;
  try {
    const url = new URL(link.url);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return link.url;
  } catch {
    return undefined;
  }
}

function isImageOnly(link: MdNode): boolean {
  const children = (link.children ?? []).filter((child) => child.type !== "text" || child.value?.trim());
  return children.length === 1 && children[0]?.type === "image";
}
