import { readdirSync } from "node:fs";

function contentPages(folder: string, prefix: string) {
  return readdirSync(`src/contents/${folder}`)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({ path: `${prefix}/${encodeURIComponent(file.slice(0, -3))}` }));
}

/** Static paths TanStack Start prerenders. `/cms-preview` stays dynamic. */
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
