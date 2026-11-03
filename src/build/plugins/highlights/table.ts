import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { collectFences } from "../../../shared/lib/highlighting/fences.ts";
import { highlightCode } from "../../../shared/lib/highlighting/highlighter.ts";
import type { HighlightBlock } from "../../../shared/lib/highlighting/highlight-context.tsx";
import { parseShikiPre } from "../../../shared/lib/highlighting/parse-shiki-pre.ts";
import { isDraft, parseMarkdownFile } from "../../../shared/lib/markdown/frontmatter.ts";

const FOLDERS = ["blogs", "memos", "works"] as const;

export type HighlightTable = {
  /** Highlighted blocks keyed by the code block lookup key. */
  blocks: Record<string, HighlightBlock>;
  /** Markdown files the table was built from, so the dev server can rebuild it on edits. */
  files: string[];
};

/**
 * Highlights every fenced code block of the content Markdown with Shiki.
 * Running it at build time keeps Shiki out of the Worker, where it exceeded the CPU limit.
 * Drafts are skipped in production builds, matching the catalog.
 */
export async function buildHighlightTable(root: string, includeDrafts: boolean): Promise<HighlightTable> {
  const blocks: Record<string, HighlightBlock> = {};
  const files: string[] = [];

  for (const folder of FOLDERS) {
    const dir = path.join(root, "src/contents", folder);
    for (const name of readdirSync(dir).filter((file) => file.endsWith(".md"))) {
      const file = path.join(dir, name);
      files.push(file);
      const { meta, body } = parseMarkdownFile(readFileSync(file, "utf8"), name, []);
      if (!includeDrafts && isDraft(meta)) continue;

      for (const fence of collectFences(body)) {
        if (blocks[fence.key]) continue;
        const html = await highlightCode(fence.code, fence.language, fence.filename);
        blocks[fence.key] = parseShikiPre(html);
      }
    }
  }

  return { blocks, files };
}
