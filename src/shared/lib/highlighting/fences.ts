import type { HighlightBlock } from "./highlight-context";
import { parseCodeMeta } from "./parse-code-meta";

/** One fenced code block found in a Markdown body. */
export type Fence = {
  /** Lookup key shared with the code block component. */
  key: string;
  code: string;
  language: string | undefined;
  filename: string | undefined;
};

const FENCE = /```([^\n]*)\n([\s\S]*?)```/g;

/** Same key the code block component builds, so a precomputed block is found by its source. */
export function fenceKey(language: string | undefined, filename: string | undefined, code: string): string {
  return `${language ?? ""}\0${filename ?? ""}\0${code}`;
}

/** Lists the distinct fenced code blocks of a Markdown body. */
export function collectFences(body: string): Fence[] {
  const fences = new Map<string, Fence>();
  for (const match of body.matchAll(FENCE)) {
    const info = (match[1] ?? "").trim();
    // Same trailing-newline rule as the client, so CRLF checkouts produce the same key.
    const code = (match[2] ?? "").replace(/\r?\n$/, "");
    const [languageToken, ...metaParts] = info.split(/\s+/);
    const language = languageToken || undefined;
    const { filename } = parseCodeMeta(metaParts.join(" "));
    const key = fenceKey(language, filename, code);
    if (!fences.has(key)) fences.set(key, { key, code, language, filename });
  }
  return [...fences.values()];
}

/**
 * Picks the highlighted blocks of one article out of the table built at build time.
 * A block missing from the table is left out; the browser highlights it on demand.
 */
export function pickHighlights(
  body: string,
  table: Readonly<Record<string, HighlightBlock>>,
): Record<string, HighlightBlock> {
  const picked: Record<string, HighlightBlock> = {};
  for (const { key } of collectFences(body)) {
    const block = table[key];
    if (block) picked[key] = block;
  }
  return picked;
}
