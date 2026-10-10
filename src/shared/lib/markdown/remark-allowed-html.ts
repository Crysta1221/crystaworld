import type { Parent, PhrasingContent, Root, RootContent } from "mdast";

import { ALLOWED_TAGS, VOID_TAGS, cleanAttributes } from "./html-allowlist";
import { tokenizeHtml } from "./html-tokens";

type ElementNode = Parent & {
  type: "html-element";
  data: { hName: string; hProperties: Record<string, string | boolean> };
};

function elementNode(tag: string, properties: Record<string, string | boolean>): ElementNode {
  return { type: "html-element", data: { hName: tag, hProperties: properties }, children: [] } as ElementNode;
}

/** Turns the `html` nodes of one parent into elements; tags may open and close in different nodes. */
function rebuild(children: RootContent[]): RootContent[] {
  const result: RootContent[] = [];
  const open: { tag: string; node: ElementNode }[] = [];
  const append = (node: RootContent) => {
    const target = open.at(-1)?.node.children ?? result;
    target.push(node as PhrasingContent);
  };

  for (const child of children) {
    if (child.type !== "html") {
      append(child);
      continue;
    }
    for (const token of tokenizeHtml(child.value)) {
      if (token.kind === "text") {
        append({ type: "text", value: token.value });
      } else if (token.kind === "open") {
        if (!ALLOWED_TAGS.has(token.tag)) continue;
        const properties = cleanAttributes(token.tag, token.attributes);
        // An image whose address was rejected would be an empty box.
        if (token.tag === "img" && !properties.src) continue;
        const node = elementNode(token.tag, properties);
        append(node as unknown as RootContent);
        if (!VOID_TAGS.has(token.tag) && !token.selfClosing) open.push({ tag: token.tag, node });
      } else {
        let index = open.length - 1;
        while (index >= 0 && open[index]?.tag !== token.tag) index -= 1;
        if (index >= 0) open.length = index;
      }
    }
  }
  return result;
}

function convert(parent: Parent) {
  for (const child of parent.children) {
    if ("children" in child) convert(child as Parent);
  }
  if (parent.children.some((child) => child.type === "html")) {
    parent.children = rebuild(parent.children as RootContent[]) as Parent["children"];
  }
}

/**
 * Renders the HTML tags on the allowlist (`<u>`, `<details>`, `<br>`, ...) found in Markdown.
 * Every other tag is dropped and its text is kept, so no script or embed reaches the page.
 */
export function remarkAllowedHtml() {
  return (tree: Root) => convert(tree);
}
