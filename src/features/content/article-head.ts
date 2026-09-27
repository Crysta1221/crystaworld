const ORIGIN = "https://crystaworld.dev";

type ArticleMetaInput = {
  title: string;
  body: string;
  imagePath: string;
};

/**
 * Head tags for one article. The shell still renders these during data-only SSR.
 */
export function articleMeta({ title, body, imagePath }: ArticleMetaInput) {
  const description = excerpt(body) || "くりすたのポートフォリオへようこそ！";
  const pageTitle = `${title} | Crystaworld`;
  const image = new URL(imagePath, ORIGIN).href;

  return {
    meta: [
      { title: pageTitle },
      { name: "description", content: description },
      { property: "og:site_name", content: "Crystaworld" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
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
