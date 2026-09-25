import type { ReactNode } from "react";

import { mulberry32 } from "./random";

type PatternProps = {
  height: number;
};

const FILL = {
  border: "var(--color-border)",
  secondary: "var(--color-secondary)",
  primary: "var(--color-primary)",
  muted: "var(--color-muted-foreground)",
} as const;

/** Wide enough that the centered pattern still covers ultra-wide screens. */
const SPAN = 4800;

function PatternSvg({ height, children }: PatternProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      width={SPAN}
      height={height}
      viewBox={`${-SPAN / 2} 0 ${SPAN} ${height}`}
      className="pointer-events-none absolute top-0 left-1/2 max-w-none -translate-x-1/2"
    >
      {children}
    </svg>
  );
}

function unit(seed: number) {
  return mulberry32(seed >>> 0)();
}

/**
 * A — Diamond Field.
 * Rounded squares rotated -45deg around the top-left, same construction as Pencil.
 * Row anchors stay centered in the band, so a new height keeps the same edge crop.
 */
export function DiamondField({ height }: PatternProps) {
  const size = 88;
  const step = 128;
  const rowCount = Math.max(2, Math.round(height / step));
  const y0 = (height - (rowCount - 1) * step) / 2;
  const tiles: { x: number; y: number; fill: string; opacity: number }[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    const y = y0 + row * step;
    const xOffset = (row % 2 === 0 ? 0 : step / 2) - Math.round((size * Math.SQRT2) / 2);
    for (let col = -18; col <= 18; col += 1) {
      const pick = unit(Math.imul(row + 3, 1103515245) + Math.imul(col + 21, 12345));
      tiles.push({
        x: col * step + xOffset,
        y,
        fill: pick > 0.94 ? FILL.primary : pick > 0.6 ? FILL.border : FILL.secondary,
        opacity: 0.16 + pick * 0.4,
      });
    }
  }

  return (
    <PatternSvg height={height}>
      {tiles.map((tile) => (
        <rect
          key={`${tile.x}-${tile.y}`}
          x={tile.x}
          y={tile.y}
          width={size}
          height={size}
          rx={24}
          fill={tile.fill}
          opacity={tile.opacity}
          transform={`rotate(-45 ${tile.x} ${tile.y})`}
        />
      ))}
    </PatternSvg>
  );
}

/** How many square rows fill the band. Raise this to make each square smaller. */
const BLUEPRINT_BANDS = 3;

const BLUEPRINT_CELLS = [
  [-5, 0],
  [-3, 1],
  [-1, 2],
  [1, 1],
  [3, 0],
  [5, 2],
  [-6, 1],
  [2, 2],
  [4, 0],
  [-2, 1],
] as const;

const BLUEPRINT_PLUSES = [
  [-4, 1],
  [-2, 2],
  [0, 1],
  [4, 2],
  [6, 0],
  [2, 0],
] as const;

/** A plus centered on a filled cell's corner reads as a stray mark on the color seam. */
function plusSitsOnCellCorner(col: number, row: number) {
  return BLUEPRINT_CELLS.some(
    ([cellCol, cellRow]) =>
      (col === cellCol || col === cellCol + 1) && (row === cellRow || row === cellRow + 1),
  );
}

/**
 * B — Blueprint Grid.
 * Cell size is the band height divided by BLUEPRINT_BANDS, so the squares
 * stay whole when the height changes.
 */
export function BlueprintGrid({ height }: PatternProps) {
  const grid = height / BLUEPRINT_BANDS;
  const verticals: number[] = [];
  const firstCol = -Math.ceil(SPAN / 2 / grid);
  const lastCol = Math.ceil(SPAN / 2 / grid);
  for (let col = firstCol; col <= lastCol; col += 1) verticals.push(col * grid);

  const horizontals = Array.from({ length: BLUEPRINT_BANDS + 1 }, (_, row) => row * grid - 1);
  const arm = grid * 0.2;

  return (
    <PatternSvg height={height}>
      {verticals.map((x) => (
        <rect
          key={`v${x}`}
          x={x}
          y={0}
          width={2}
          height={height}
          fill={FILL.border}
          opacity={0.4}
        />
      ))}
      {horizontals.map((y) => (
        <rect
          key={`h${y}`}
          x={-SPAN / 2}
          y={y}
          width={SPAN}
          height={2}
          fill={FILL.border}
          opacity={0.4}
        />
      ))}
      {BLUEPRINT_CELLS.map(([col, row]) => (
        <rect
          key={`c${col}-${row}`}
          x={col * grid}
          y={row * grid}
          width={grid}
          height={grid}
          fill={FILL.secondary}
          opacity={0.7}
        />
      ))}
      {BLUEPRINT_PLUSES.filter(([col, row]) => !plusSitsOnCellCorner(col, row)).map(([col, row]) => {
        const x = col * grid;
        const y = row * grid;
        return (
          <g key={`p${col}-${row}`} fill={FILL.muted} opacity={0.65}>
            <rect x={x - arm / 2} y={y - 1.5} width={arm} height={3} />
            <rect x={x - 1.5} y={y - arm / 2} width={3} height={arm} />
          </g>
        );
      })}
    </PatternSvg>
  );
}

/** Pointy-top hex from the Pencil polygon, drawn in a 60×60 box. */
const HEX_PATH =
  "M27 1.732 C28.856 0.66 31.144 0.66 33 1.732 L52.981 13.268 C54.837 14.34 55.981 16.321 55.981 18.464 L55.981 41.536 C55.981 43.679 54.837 45.66 52.981 46.732 L33 58.268 C31.144 59.34 28.856 59.34 27 58.268 L7.019 46.732 C5.163 45.66 4.019 43.679 4.019 41.536 L4.019 18.464 C4.019 16.321 5.163 14.34 7.019 13.268 L27 1.732 Z";

/** Pencil hex: 60px box, 68px column pitch, 52px row pitch. */
const HEX_SCALE = 1.64;
const HEX_BOX = 60 * HEX_SCALE;
const HEX_COL = 68 * HEX_SCALE;
const HEX_ROW = 52 * HEX_SCALE;
const HEX_VISUAL = 58.6 * HEX_SCALE;

/**
 * C — Honeycomb.
 * Same pitch ratio as the Pencil matrix, so rows nest instead of stacking on top of each other.
 * The first and last rows are clipped by the same amount.
 */
export function HoneycombMatrix({ height }: PatternProps) {
  const rowCount = Math.max(2, Math.round(height / HEX_ROW));
  const clip = ((rowCount - 1) * HEX_ROW + HEX_VISUAL - height) / 2;
  const hexes: { x: number; y: number; fill: string; opacity: number }[] = [];

  for (let row = -1; row <= rowCount; row += 1) {
    const y = -clip + row * HEX_ROW;
    const xOffset = row % 2 === 0 ? -HEX_BOX / 2 : -HEX_BOX / 2 + HEX_COL / 2;
    for (let col = -26; col <= 26; col += 1) {
      const pick = unit(Math.imul(row + 9, 214013) + Math.imul(col + 13, 2531011));
      hexes.push({
        x: col * HEX_COL + xOffset,
        y,
        fill: pick > 0.7 ? FILL.border : FILL.secondary,
        opacity: 0.2 + pick * 0.24,
      });
    }
  }

  return (
    <PatternSvg height={height}>
      {hexes.map((hex) => (
        <path
          key={`${hex.x}-${hex.y}`}
          d={HEX_PATH}
          transform={`translate(${hex.x} ${hex.y}) scale(${HEX_SCALE})`}
          fill={hex.fill}
          opacity={hex.opacity}
        />
      ))}
    </PatternSvg>
  );
}
