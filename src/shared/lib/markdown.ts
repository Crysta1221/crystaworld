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

  const meta = parseFrontmatter(match[1] ?? "");

  for (const key of required) {
    if (!meta[key]) throw new Error(`Missing ${key} in ${path}`);
  }

  return { meta, body: (match[2] ?? "").trim() };
}

/**
 * Reads flat frontmatter. Scalars stay strings. YAML lists and flow lists
 * become comma-separated strings so older files and CMS saves share one shape.
 */
function parseFrontmatter(block: string): Record<string, string> {
  const lines = block.split(/\r?\n/);
  const meta: Record<string, string> = {};

  for (let index = 0; index < lines.length; index += 1) {
    const field = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(lines[index] ?? "");
    if (!field?.[1]) continue;

    const key = field[1];
    const inline = (field[2] ?? "").trim();
    if (inline !== "") {
      meta[key] = parseScalar(inline);
      continue;
    }

    const items: string[] = [];
    while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1] ?? "")) {
      index += 1;
      const item = /^\s+-\s+(.*)$/.exec(lines[index] ?? "")?.[1] ?? "";
      items.push(unquote(item.trim()));
    }
    meta[key] = items.join(", ");
  }

  return meta;
}

function parseScalar(value: string): string {
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (inner === "") return "";
    return inner
      .split(",")
      .map((item) => unquote(item.trim()))
      .filter((item) => item.length > 0)
      .join(", ");
  }

  return unquote(value);
}

function unquote(value: string): string {
  const quoted =
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"));
  return quoted ? value.slice(1, -1) : value;
}

export function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
