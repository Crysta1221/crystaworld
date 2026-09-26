export type MarkdownFile = {
  meta: Record<string, string>;
  /** One-level lists of objects, such as CMS link buttons. */
  records: Record<string, readonly Record<string, string>[]>;
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

  const { meta, records } = parseFrontmatter(match[1] ?? "");

  for (const key of required) {
    if (!meta[key]) throw new Error(`Missing ${key} in ${path}`);
  }

  return { meta, records, body: (match[2] ?? "").trim() };
}

/**
 * Reads flat frontmatter. Scalars stay strings. String lists and flow lists
 * become comma-separated strings so older files and CMS saves share one shape.
 * A list of `key: value` maps is kept on `records` instead.
 */
function parseFrontmatter(block: string): {
  meta: Record<string, string>;
  records: Record<string, Record<string, string>[]>;
} {
  const lines = block.split(/\r?\n/);
  const meta: Record<string, string> = {};
  const records: Record<string, Record<string, string>[]> = {};

  for (let index = 0; index < lines.length; index += 1) {
    const field = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(lines[index] ?? "");
    if (!field?.[1]) continue;

    const key = field[1];
    const inline = (field[2] ?? "").trim();
    if (inline !== "") {
      meta[key] = parseScalar(inline);
      continue;
    }

    const list = readList(lines, index);
    index = list.nextIndex;
    if (list.records.length > 0) {
      records[key] = list.records;
      continue;
    }
    meta[key] = list.items.join(", ");
  }

  return { meta, records };
}

function readList(
  lines: readonly string[],
  keyIndex: number,
): { items: string[]; records: Record<string, string>[]; nextIndex: number } {
  const items: string[] = [];
  const records: Record<string, string>[] = [];
  let index = keyIndex;

  while (index + 1 < lines.length) {
    const item = /^(\s+)-\s+(.*)$/.exec(lines[index + 1] ?? "");
    if (!item?.[1]) break;

    index += 1;
    const dashIndent = item[1].length;
    const content = (item[2] ?? "").trim();
    const entry = parseKeyValue(content);

    if (!entry) {
      items.push(unquote(content));
      continue;
    }

    const record: Record<string, string> = { [entry.key]: entry.value };
    while (index + 1 < lines.length) {
      const next = lines[index + 1] ?? "";
      if (next.trim() === "" || /^\s*-\s+/.test(next)) break;
      const nested = /^(\s+)([A-Za-z0-9_-]+):\s*(.*)$/.exec(next);
      if (!nested?.[1] || !nested[2] || nested[1].length <= dashIndent) break;
      index += 1;
      record[nested[2]] = unquote((nested[3] ?? "").trim());
    }
    records.push(record);
  }

  return { items, records, nextIndex: index };
}

function parseKeyValue(value: string): { key: string; value: string } | undefined {
  const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(value);
  if (!match?.[1]) return undefined;
  return { key: match[1], value: unquote((match[2] ?? "").trim()) };
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
