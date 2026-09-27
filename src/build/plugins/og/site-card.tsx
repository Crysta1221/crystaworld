import type { CSSProperties } from "react";

import { bluePalette, type OgPalette } from "./palette";
import { capsuleCluster, cornerCircle, roundedSquare } from "./shapes";

const INK = "#3d4259";
const SUB = "#6c7293";

type SiteCardProps = {
  avatarSrc: string;
  palette?: OgPalette;
};

/**
 * Minimal, centered social card for the site root and non-article pages.
 * Displays the avatar with Crystaworld typography and portfolio subtitle,
 * without the inner white card frame.
 */
export function SiteCard({ avatarSrc, palette = bluePalette }: SiteCardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: palette.frame,
        fontFamily: "Zen Maru Gothic",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Mark graphic={capsuleCluster(palette)} style={{ top: -20, left: -36 }} />
      <Mark graphic={roundedSquare(palette)} style={{ top: -78, right: -72 }} />
      <Mark graphic={cornerCircle(palette)} style={{ right: -48, bottom: -40 }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <img
          src={avatarSrc}
          alt=""
          width={150}
          height={150}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            objectFit: "cover",
            objectPosition: "50% 22%",
            boxShadow: "0 8px 24px rgba(60, 80, 120, 0.15)",
            border: "4px solid #ffffff",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Natadecoco",
              fontSize: 92,
              fontWeight: 400,
              color: INK,
              lineHeight: 1.1,
              letterSpacing: "0.01em",
            }}
          >
            Crystaworld
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 500,
              color: SUB,
              marginTop: 10,
            }}
          >
            くりすたのポートフォリオ
          </div>
        </div>
      </div>
    </div>
  );
}

function Mark({
  graphic,
  style,
}: {
  graphic: { src: string; width: number; height: number };
  style: CSSProperties;
}) {
  return (
    <div style={{ position: "absolute", display: "flex", width: graphic.width, height: graphic.height, ...style }}>
      <img
        src={graphic.src}
        alt=""
        width={graphic.width}
        height={graphic.height}
        style={{ width: graphic.width, height: graphic.height }}
      />
    </div>
  );
}
