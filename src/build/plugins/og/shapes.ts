import type { OgPalette } from "./palette";

type Stripe = Pick<OgPalette, "track" | "stripe" | "square">;

/** Diagonal stripes clipped to a real shape, so the silhouette is not a rotated box. */
function stripedSvg(width: number, height: number, body: string, palette: Stripe, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <pattern id="s" patternUnits="userSpaceOnUse" width="22" height="22" patternTransform="rotate(-36)">
        <rect width="22" height="22" fill="${palette.track}"/>
        <rect width="11" height="22" fill="${color}"/>
      </pattern>
    </defs>
    ${body}
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** The original top-left pair: two capsules on the same diagonal. */
export function capsuleCluster(palette: Stripe): { src: string; width: number; height: number } {
  const width = 420;
  const height = 250;
  const stripes = `fill="url(#s)"`;
  const body = `
    <g transform="rotate(-32 150 78)">
      <rect x="16" y="36" width="300" height="74" rx="37" ${stripes}/>
    </g>
    <g transform="rotate(-32 210 128)">
      <rect x="108" y="96" width="210" height="56" rx="28" ${stripes}/>
    </g>`;
  return { src: stripedSvg(width, height, body, palette, palette.stripe), width, height };
}

export function roundedSquare(palette: Stripe): { src: string; width: number; height: number } {
  const size = 210;
  const body = `<rect x="6" y="6" width="198" height="198" rx="28" fill="url(#s)"/>`;
  return { src: stripedSvg(size, size, body, palette, palette.square), width: size, height: size };
}

export function cornerCircle(palette: Stripe): { src: string; width: number; height: number } {
  const size = 210;
  const body = `<circle cx="105" cy="105" r="105" fill="url(#s)"/>`;
  return { src: stripedSvg(size, size, body, palette, palette.stripe), width: size, height: size };
}
