import type { CSSProperties } from "react";

import { bluePalette, type OgPalette } from "./palette";
import { capsuleCluster, cornerCircle, roundedSquare } from "./shapes";

const CARD = "#f7f8fc";
const INK = "#4c4f69";
const MUTED = "#6c6f85";
const TAG = "#e6e9ef";

type CardProps = {
  title: string;
  avatarSrc: string;
  /** Section name such as "Blogs" or "Memos". */
  label?: string;
  /** Date or category, shown under the title. */
  meta?: string;
  tags?: readonly string[];
  palette?: OgPalette;
};

/**
 * Geometric social card. Stripe shapes sit on the outer frame, behind the sheet,
 * so the title never shares the inner surface with them.
 */
export function OgCard({ title, avatarSrc, label, meta, tags = [], palette = bluePalette }: CardProps) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: palette.frame,
        padding: 48,
        fontFamily: "Zen Maru Gothic",
      }}
    >
      <Mark graphic={capsuleCluster(palette)} style={{ top: -20, left: -36 }} />
      <Mark graphic={roundedSquare(palette)} style={{ top: -78, right: -72 }} />
      <Mark graphic={cornerCircle(palette)} style={{ right: -48, bottom: -40 }} />

      <div
        style={{
          display: "flex",
          position: "relative",
          flex: 1,
          overflow: "hidden",
          borderRadius: 36,
          backgroundColor: CARD,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            paddingTop: 52,
            paddingLeft: 64,
            paddingRight: 64,
          }}
        >
          {label ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 42,
                paddingLeft: 16,
                paddingRight: 16,
                borderRadius: 21,
                backgroundColor: palette.pill,
                color: INK,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: label ? 16 : 0,
              textAlign: "left",
              fontSize: titleSize(title),
              fontWeight: 700,
              lineHeight: 1.3,
              color: INK,
            }}
          >
            {title}
          </div>
          {meta ? (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 28,
                fontWeight: 500,
                color: MUTED,
              }}
            >
              {meta}
            </div>
          ) : null}
          {tags.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%", marginTop: 16 }}>
              {tags.slice(0, 6).map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: 36,
                    marginRight: 8,
                    marginBottom: 8,
                    paddingLeft: 14,
                    paddingRight: 14,
                    borderRadius: 18,
                    backgroundColor: TAG,
                    color: MUTED,
                    fontSize: 20,
                    fontWeight: 500,
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            position: "absolute",
            left: 64,
            bottom: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={avatarSrc}
            alt=""
            width={68}
            height={68}
            style={{
              width: 68,
              height: 68,
              borderRadius: 34,
              objectFit: "cover",
              objectPosition: "50% 22%",
            }}
          />
          <div
            style={{
              display: "flex",
              marginLeft: 16,
              fontSize: 30,
              fontWeight: 700,
              color: INK,
            }}
          >
            くりすた
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

function titleSize(title: string): number {
  const length = Array.from(title).length;
  if (length <= 12) return 68;
  if (length <= 22) return 56;
  if (length <= 36) return 48;
  return 40;
}
