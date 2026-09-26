type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
};

/**
 * A paragraph that only wraps an image becomes the image,
 * so the renderer can use a figure and caption.
 */
export function remarkUnwrapImages() {
  return (tree: MdNode) => {
    unwrap(tree);
  };
}

function unwrap(node: MdNode) {
  const children = node.children;
  if (!children) return;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (!child) continue;

    if (child.type === "paragraph" && isLoneImage(child)) {
      const image = child.children?.[0];
      if (image) children[index] = image;
      continue;
    }

    unwrap(child);
  }
}

function isLoneImage(paragraph: MdNode): boolean {
  const content = (paragraph.children ?? []).filter((child) => child.type !== "text" || Boolean(child.value?.trim()));
  return content.length === 1 && content[0]?.type === "image";
}
