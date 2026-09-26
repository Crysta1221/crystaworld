import { readFileSync } from "node:fs";
import { join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { OgCard } from "./card";
import { loadOgFonts, type OgFont } from "./fonts";
import type { OgManifest } from "./head";
import { bluePalette, greenPalette, type OgPalette } from "./palette";
import { formatOgDate, readBlogPosts, readMemoPosts, siteDescription, type OgBlogPost } from "./posts";
import { SiteCard } from "./site-card";

export type OgAssets = {
  manifest: OgManifest;
  images: Map<string, Buffer>;
};

const SECTIONS = [
  { folder: "blogs", label: "Blogs", posts: readBlogPosts, palette: bluePalette },
  { folder: "memos", label: "Memos", posts: readMemoPosts, palette: greenPalette },
] as const;

/**
 * Renders the site card and one card per blog or memo. Titles come from Markdown frontmatter.
 */
export async function renderOgAssets(root = process.cwd()): Promise<OgAssets> {
  const fonts = loadOgFonts(root);
  const avatarSrc = loadAvatar(root);
  const images = new Map<string, Buffer>();
  const articles: OgManifest["articles"] = {};

  images.set("og/default.png", await renderSiteCard(fonts, avatarSrc));

  for (const section of SECTIONS) {
    for (const post of section.posts(root)) {
      const file = `og/${section.folder}/${post.id}.png`;
      const pathname = `/${section.folder}/${post.id}`;
      images.set(file, await renderPost(fonts, avatarSrc, post, section.label, section.palette));
      articles[pathname] = {
        title: post.title,
        description: post.description,
        image: `/${file}`,
        type: "article",
      };
    }
  }

  return {
    images,
    manifest: {
      site: {
        title: "Crystaworld",
        description: siteDescription(),
        image: "/og/default.png",
        type: "website",
      },
      articles,
    },
  };
}

function loadAvatar(root: string): string {
  const bytes = readFileSync(join(root, "public/images/crysta-avatar.jpeg"));
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

async function renderPost(
  fonts: OgFont[],
  avatarSrc: string,
  post: OgBlogPost,
  label: string,
  palette: OgPalette,
): Promise<Buffer> {
  return renderCard(fonts, avatarSrc, post.title, label, formatOgDate(post.date), post.tags, palette);
}

async function renderSiteCard(
  fonts: OgFont[],
  avatarSrc: string,
  palette: OgPalette = bluePalette,
): Promise<Buffer> {
  const svg = await satori(<SiteCard avatarSrc={avatarSrc} palette={palette} />, {
    width: 1200,
    height: 630,
    fonts,
  });
  return Buffer.from(new Resvg(svg).render().asPng());
}

async function renderCard(
  fonts: OgFont[],
  avatarSrc: string,
  title: string,
  label?: string,
  meta?: string,
  tags?: readonly string[],
  palette: OgPalette = bluePalette,
): Promise<Buffer> {
  const svg = await satori(
    <OgCard title={title} avatarSrc={avatarSrc} label={label} meta={meta} tags={tags} palette={palette} />,
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );
  return Buffer.from(new Resvg(svg).render().asPng());
}
