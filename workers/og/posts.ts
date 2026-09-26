import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { parseMarkdownFile, splitList } from "../../src/shared/lib/markdown";

export type OgBlogPost = {
  id: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
};

const SITE_DESCRIPTION =
  "学生エンジニアの「くりすた」のポートフォリオ。Web から気になったものを気ままに作っています。";

export function siteDescription(): string {
  return SITE_DESCRIPTION;
}

/**
 * Reads blog Markdown the same way the catalog does, without pulling the app bundle.
 */
export function readBlogPosts(root = process.cwd()): OgBlogPost[] {
  return readContentPosts(root, "blogs");
}

export function readMemoPosts(root = process.cwd()): OgBlogPost[] {
  return readContentPosts(root, "memos");
}

function readContentPosts(root: string, folder: "blogs" | "memos"): OgBlogPost[] {
  const dir = join(root, "src/contents", folder);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const id = file.slice(0, -3);
      const source = readFileSync(join(dir, file), "utf8");
      const { meta, body } = parseMarkdownFile(source, file, ["title", "date"]);
      return {
        id,
        title: meta.title ?? id,
        date: meta.date ?? "",
        description: excerpt(body) || SITE_DESCRIPTION,
        tags: splitList(meta.tags ?? ""),
      };
    });
}

export function formatOgDate(date: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(date);
  if (!match?.[1] || !match[2]) return date;
  return `${match[1]}年${Number(match[2])}月`;
}

function excerpt(body: string): string {
  const paragraph = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith("#") && !block.startsWith("```"));
  if (!paragraph) return "";
  const plain = paragraph
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= 120) return plain;
  return `${plain.slice(0, 119)}…`;
}
