import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { OgCard } from "./card";
import { loadOgFonts } from "./fonts";
import { greenPalette } from "./palette";

const root = process.cwd();
const avatar = readFileSync(join(root, "public/images/crysta-avatar.jpeg"));
const avatarSrc = `data:image/jpeg;base64,${avatar.toString("base64")}`;
const svg = await satori(
  <OgCard
    title="メモのタイトル"
    avatarSrc={avatarSrc}
    label="Memos"
    meta="2026年9月"
    tags={["React", "TypeScript"]}
    palette={greenPalette}
  />,
  { width: 1200, height: 630, fonts: loadOgFonts(root) },
);
const png = new Resvg(svg).render().asPng();
writeFileSync(join(root, "workers/og/preview-green.png"), png);
