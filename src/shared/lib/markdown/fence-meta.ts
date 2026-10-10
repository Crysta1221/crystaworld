import type { Element } from "hast";

/**
 * Text after the language on a code fence, such as `title="vite.config.ts"`.
 * react-markdown does not pass it as a prop; it stays on `data.meta` of the `<code>` element.
 */
export function fenceMeta(pre: unknown): string {
  const children = (pre as Element | undefined)?.children ?? [];
  const code = children.find(
    (child): child is Element => child.type === "element" && child.tagName === "code",
  );
  const meta = (code?.data as { meta?: unknown } | undefined)?.meta;
  return typeof meta === "string" ? meta : "";
}
