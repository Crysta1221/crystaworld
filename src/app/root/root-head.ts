import fontPreloads from "virtual:crystaworld/font-preloads";

import { SITE_DESCRIPTION, SITE_NAME, SITE_ORIGIN } from "@/shared/lib/site";

import { THEME_BOOT } from "./theme-boot";

const fontPreload = (href: string, type: string) => ({
  rel: "preload",
  href,
  as: "font",
  type,
  crossOrigin: "anonymous" as const,
});

/** Document head shared by every page. Child routes override the page-specific tags. */
export function rootHead() {
  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: SITE_NAME },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SITE_NAME },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/` },
      { property: "og:image", content: `${SITE_ORIGIN}/og/default.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/images/crysta-avatar.webp", type: "image/webp", sizes: "160x160" },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      fontPreload("/fonts/Natadecoco-gothic.otf", "font/otf"),
      ...fontPreloads.map((href) => fontPreload(href, "font/woff2")),
    ],
    scripts: [{ children: THEME_BOOT }],
  };
}
