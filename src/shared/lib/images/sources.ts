import { imageSize } from "@/shared/lib/images/sizes";

/** A narrower file for viewports that do not need the full screenshot. */
export function responsiveSources(src: string): { src?: string; srcSet?: string; sizes?: string } {
  const size = imageSize(src);
  if (!size || size.width <= 900 || src.includes("scroll-demo")) return {};
  const compact = src.replace(/\.(webp|png|jpe?g)$/i, "-800.webp");
  return {
    src: compact,
    srcSet: `${compact} 800w, ${src} ${size.width}w`,
    sizes: "(min-width: 1024px) 960px, 100vw",
  };
}
