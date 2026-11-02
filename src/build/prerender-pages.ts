import { readdirSync, readFileSync } from "node:fs";

import { isDraft, parseMarkdownFile } from "../shared/lib/markdown/frontmatter.ts";

function contentPages(folder: string, prefix: string) {
  return readdirSync(`src/contents/${folder}`)
    .filter((file) => file.endsWith(".md"))
    .filter((file) => !isDraftFile(`src/contents/${folder}/${file}`))
    .map((file) => ({ path: `${prefix}/${encodeURIComponent(file.slice(0, -3))}` }));
}

function isDraftFile(path: string): boolean {
  const { meta } = parseMarkdownFile(readFileSync(path, "utf8"), path, []);
  return isDraft(meta);
}

/** Static paths TanStack Start prerenders. Drafts are skipped; `/cms-preview` stays dynamic. */
export function prerenderPages() {
  return [
    { path: "/" },
    { path: "/works" },
    { path: "/blogs" },
    { path: "/memos" },
    ...contentPages("works", "/works"),
    ...contentPages("blogs", "/blogs"),
    ...contentPages("memos", "/memos"),
  ];
}
