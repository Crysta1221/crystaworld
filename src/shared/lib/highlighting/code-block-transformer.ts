import type { ElementContent } from "hast";
import type { ShikiTransformer } from "shiki";

function hastText(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map((child) => hastText(child)).join("");
  return "";
}

function stripLeadingDiffMark(children: ElementContent[]): ElementContent[] {
  if (children.length === 0) return children;

  const [first, ...rest] = children;
  if (first.type === "text") {
    if (first.value.startsWith("+") || first.value.startsWith("-")) {
      const next = first.value.slice(1);
      return next.length > 0 ? [{ ...first, value: next }, ...rest] : rest;
    }
    return children;
  }

  if (first.type === "element") {
    return [{ ...first, children: stripLeadingDiffMark(first.children) }, ...rest];
  }

  return children;
}

export const codeBlockTransformer: ShikiTransformer = {
  name: "code-block-gutter",
  pre(hast) {
    const meta = this.options.meta as { filename?: string } | undefined;
    const filename = meta?.filename;
    hast.properties = {
      ...hast.properties,
      ...(filename ? { "data-filename": filename } : {}),
      "data-language": this.options.lang,
    };
  },
  line(hast, line) {
    this.addClassToHast(hast, "line");
    const language = String(this.options.lang ?? "");
    const text = hast.children.map((child) => hastText(child)).join("");
    const isDiff = language === "diff";
    const mark = isDiff && text.startsWith("+") ? "+" : isDiff && text.startsWith("-") ? "-" : "";
    const diff = mark === "+" ? "add" : mark === "-" ? "remove" : undefined;

    hast.properties = {
      ...hast.properties,
      "data-line": line,
      ...(diff ? { "data-diff": diff } : {}),
    };

    const codeChildren = mark ? stripLeadingDiffMark(hast.children) : hast.children;

    const gutterChildren: ElementContent[] = [
      {
        type: "element",
        tagName: "span",
        properties: { class: "line-number", "aria-hidden": "true" },
        children: [{ type: "text", value: String(line) }],
      },
    ];
    if (isDiff) {
      gutterChildren.push({
        type: "element",
        tagName: "span",
        properties: { class: "line-diff", "aria-hidden": "true" },
        children: mark ? [{ type: "text", value: mark }] : [],
      });
    }

    hast.children = [
      {
        type: "element",
        tagName: "span",
        properties: { class: "line-gutter", "aria-hidden": "true" },
        children: gutterChildren,
      },
      {
        type: "element",
        tagName: "span",
        properties: { class: "line-code" },
        children: codeChildren,
      },
    ];
  },
};
