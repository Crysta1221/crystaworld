import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/shared/lib/site";

type ArticleMetaInput = {
  title: string;
  body: string;
  /** Page path, such as `/blogs/welcome`. */
  path: string;
  imagePath: string;
};

/**
 * Head tags for one article. The shell still renders these during data-only SSR.
 */
export function articleMeta({ title, body, path, imagePath }: ArticleMetaInput) {
  const description = excerpt(body) || SITE_DESCRIPTION;
  const pageTitle = `${title} | ${SITE_NAME}`;
  const image = new URL(imagePath, SITE_ORIGIN).href;
  const url = new URL(path, SITE_ORIGIN).href;

  return {
    meta: [
      { title: pageTitle },
      { name: "description", content: description },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
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
