export function parseCodeMeta(metaString: string): { filename?: string } {
  const named = /(?:title|filename|file)\s*=\s*(?:"([^"]+)"|'([^']+)'|(\S+))/i.exec(metaString);
  const filename = named?.[1] ?? named?.[2] ?? named?.[3];
  if (filename) return { filename };

  const leftover = metaString
    .replace(/\{[^}]*\}/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .at(-1);

  if (leftover && (leftover.includes(".") || leftover.includes("/"))) {
    return { filename: leftover };
  }

  return {};
}
