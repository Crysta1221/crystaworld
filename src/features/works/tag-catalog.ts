import { parseMarkdownFile } from "@/shared/lib/markdown";

export type WorkTag = {
  name: string;
  icon: string;
  /** Monochrome marks are painted with the text color so they stay visible in both themes. */
  mask: boolean;
  /** Wider marks, such as wordmarks, need a different box than a square icon. */
  wide: boolean;
};

const sources = import.meta.glob("/src/contents/tech-tags/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const TAGS = loadTags();

/**
 * Tech tags are registered in the CMS as Markdown under src/contents/tech-tags.
 * A work stores the tag name; the icon lives on the tag entry.
 * Blog and memo tags are a separate collection and are not resolved here.
 */
export function tagFor(name: string): WorkTag | undefined {
  return TAGS.get(name);
}

function loadTags(): ReadonlyMap<string, WorkTag> {
  const tags = new Map<string, WorkTag>();

  for (const [path, source] of Object.entries(sources)) {
    const { meta } = parseMarkdownFile(source, path, ["name"]);
    const name = meta.name ?? "";
    if (!name || tags.has(name)) continue;
    tags.set(name, {
      name,
      icon: meta.icon ?? "",
      mask: meta.mask === "true",
      wide: meta.wide === "true",
    });
  }

  return tags;
}
