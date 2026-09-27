import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ReactNode } from "react";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import sharp from "sharp";

import { OgCard } from "./card";
import { loadOgFonts, type OgFont } from "./fonts";
import { bluePalette, greenPalette } from "./palette";
import { formatOgDate, readOgPosts } from "./posts";
import { SiteCard } from "./site-card";

/** Output file name (such as `og/blogs/welcome.png`) to image bytes. */
export type OgImages = Map<string, Buffer>;

const SECTIONS = [
  { folder: "blogs", label: "Blogs", palette: bluePalette },
  { folder: "memos", label: "Memos", palette: greenPalette },
] as const;

/**
 * Renders the site card and one card per blog or memo.
 * Posts get a PNG for crawlers and a WebP for the in-app cards.
 */
export async function renderOgImages(root = process.cwd()): Promise<OgImages> {
  const fonts = loadOgFonts(root);
  const avatarSrc = loadAvatar(root);
  const images: OgImages = new Map();

  images.set("og/default.png", await renderPng(<SiteCard avatarSrc={avatarSrc} palette={bluePalette} />, fonts));

  for (const section of SECTIONS) {
    for (const post of readOgPosts(section.folder, root)) {
      const card = (
        <OgCard
          title={post.title}
          avatarSrc={avatarSrc}
          label={section.label}
          meta={formatOgDate(post.date)}
          tags={post.tags}
          palette={section.palette}
        />
      );
      const png = await renderPng(card, fonts);
      const base = `og/${section.folder}/${post.id}`;
      images.set(`${base}.png`, png);
      images.set(`${base}.webp`, await sharp(png).webp({ quality: 82, effort: 4 }).toBuffer());
    }
  }

  return images;
}

function loadAvatar(root: string): string {
  const bytes = readFileSync(join(root, "public/images/crysta-avatar.jpeg"));
  return `data:image/jpeg;base64,${bytes.toString("base64")}`;
}

async function renderPng(node: ReactNode, fonts: OgFont[]): Promise<Buffer> {
  const svg = await satori(node, { width: 1200, height: 630, fonts });
  return Buffer.from(new Resvg(svg).render().asPng());
}
