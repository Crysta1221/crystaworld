import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { isDraft, parseMarkdownFile, splitList } from "../../../shared/lib/markdown/frontmatter.ts";

export type OgPost = {
  id: string;
  title: string;
  date: string;
  tags: string[];
};

export type OgFolder = "blogs" | "memos";

/**
 * Reads post Markdown the same way the catalog does, without pulling the app bundle.
 * Drafts are skipped unless `includeDrafts` is set.
 */
export function readOgPosts(folder: OgFolder, root = process.cwd(), includeDrafts = false): OgPost[] {
  const dir = join(root, "src/contents", folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const id = file.slice(0, -3);
      const source = readFileSync(join(dir, file), "utf8");
      const { meta } = parseMarkdownFile(source, file, ["title", "date"]);
      if (!includeDrafts && isDraft(meta)) return [];
      return [
        {
          id,
          title: meta.title ?? id,
          date: meta.date ?? "",
          tags: splitList(meta.tags ?? ""),
        },
      ];
    });
}

export function formatOgDate(date: string): string {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(date);
  if (!match?.[1] || !match[2]) return date;
  const day = match[3] ? Number(match[3]) : undefined;
  const monthLabel = `${match[1]}年${Number(match[2])}月`;
  return day ? `${monthLabel}${day}日` : monthLabel;
}
