import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/** Always part of the home bold subset: the site name in the header. */
const CRITICAL_BOLD = "くりすた";
/** Weights 600 and above resolve to the 700 face. */
const BOLD_SOURCE = /font-(?:semibold|bold|extrabold|black)\b|font-weight:\s*[6-9]00/;
/** Content folders whose Markdown bodies render as article pages. */
const ARTICLE_FOLDERS = new Set(["works", "blogs", "memos"]);

/** Sources that render on the home page. Their glyphs go into the preloaded files. */
const HOME_SOURCES = [
  "/features/home/",
  "/features/locale/",
  "/features/theme/",
  "/components/layout/",
  "/app/root/",
  "/routes/__root.tsx",
  "/routes/index.tsx",
];

/** Build tooling and the Worker never render text in the browser. */
const SKIPPED_DIRS = new Set(["build", "server"]);

/** An app source file (TS/TSX). */
export type SourceText = {
  text: string;
  /** Whole file when it paints any text at weight 700. */
  bold: string;
  home: boolean;
};

/** A Markdown article (work, blog, or memo). */
export type ArticleText = {
  /** Stable, ASCII-only name used for its font files. */
  name: string;
  /** Frontmatter and the first paragraph: what index cards show. */
  card: string;
  /** Title, which index cards paint bold. */
  title: string;
  /** The whole file: what the detail page renders. */
  full: string;
  /** What the detail page paints bold. */
  bold: string;
};

export type FontCorpus = {
  sources: SourceText[];
  /** Markdown outside the article folders (tags, categories). */
  labels: string;
  articles: ArticleText[];
};

export function collectCorpus(srcDir: string): FontCorpus {
  const corpus: FontCorpus = { sources: [], labels: "", articles: [] };
  for (const file of walk(srcDir, true)) {
    const text = readFileSync(file, "utf8");
    const normalized = file.replaceAll("\\", "/");
    if (!file.endsWith(".md")) {
      const home = HOME_SOURCES.some((part) => normalized.includes(part));
      corpus.sources.push({ text, bold: BOLD_SOURCE.test(text) ? text : "", home });
      continue;
    }
    const folder = path.basename(path.dirname(file));
    if (!ARTICLE_FOLDERS.has(folder)) {
      corpus.labels += text;
      continue;
    }
    corpus.articles.push(articleText(`${folder}-${corpus.articles.length}`, text.replaceAll("\r\n", "\n")));
  }
  corpus.sources.push({ text: CRITICAL_BOLD, bold: CRITICAL_BOLD, home: true });
  return corpus;
}

function articleText(name: string, source: string): ArticleText {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  const frontmatter = match?.[1] ?? "";
  const body = source.slice(match?.[0].length ?? 0);
  const firstParagraph =
    body
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .find((block) => block.length > 0 && !block.startsWith("#") && !block.startsWith("```")) ?? "";
  const title = /^title:\s*(.+)$/m.exec(frontmatter)?.[1] ?? "";
  return {
    name,
    card: `${frontmatter}\n${firstParagraph}`,
    title,
    full: source,
    bold: `${title}\n${boldText(body)}`,
  };
}

/** Headings, strong text, and table header rows. */
function boldText(body: string): string {
  const parts: string[] = [];
  for (const heading of body.matchAll(/^#{1,6}[ \t]+(.+)$/gm)) parts.push(heading[1] ?? "");
  const strong = /\*\*([^*]+)\*\*|__([^_]+)__|<(?:strong|b|th)>([\s\S]*?)<\/(?:strong|b|th)>/g;
  for (const match of body.matchAll(strong)) parts.push(match[1] ?? match[2] ?? match[3] ?? "");
  // A Markdown table header is the row right above the `| --- |` delimiter row.
  for (const header of body.matchAll(/^(\|.*\|)[ \t]*\n\|?[ \t]*:?-{3,}/gm)) parts.push(header[1] ?? "");
  return parts.join("\n");
}

function walk(dir: string, isRoot = false, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    if (isRoot && entry.isDirectory() && SKIPPED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, false, acc);
    else if (/\.(tsx?|md)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}
