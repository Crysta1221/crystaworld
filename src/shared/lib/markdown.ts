export type MarkdownFile = {
  meta: Record<string, string>;
  body: string;
};

/**
 * Tiny frontmatter reader for the Markdown files in src/contents.
 */
export function parseMarkdownFile(
  source: string,
  path: string,
  required: readonly string[],
): MarkdownFile {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source.trim());
  if (!match) throw new Error(`Missing frontmatter in ${path}`);

  const meta: Record<string, string> = {};
  for (const line of (match[1] ?? "").split(/\r?\n/)) {
    const field = /^([A-Za-z0-9]+):\s*(.*)$/.exec(line);
    if (!field || !field[1]) continue;
    meta[field[1]] = field[2]?.trim() ?? "";
  }

  for (const key of required) {
    if (!meta[key]) throw new Error(`Missing ${key} in ${path}`);
  }

  return { meta, body: (match[2] ?? "").trim() };
}

export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
