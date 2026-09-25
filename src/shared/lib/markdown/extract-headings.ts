import GithubSlugger from "github-slugger";

export interface MarkdownHeadingItem {
  id: string;
  text: string;
  depth: number;
}

/**
 * Extracts h2 and h3 headings from a markdown string for generating Table of Contents.
 */
export function extractHeadings(markdown: string): MarkdownHeadingItem[] {
  const slugger = new GithubSlugger();
  const headings: MarkdownHeadingItem[] = [];

  // Remove code blocks to avoid matching headers inside code
  const stripped = markdown.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(stripped)) !== null) {
    const hashes = match[1];
    const rawText = match[2];
    if (!hashes || !rawText) continue;

    const depth = hashes.length;
    // Strip markdown formatting like bold, links, inline code
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();

    if (!cleanText) continue;

    const id = slugger.slug(cleanText);
    headings.push({ id, text: cleanText, depth });
  }

  return headings;
}
