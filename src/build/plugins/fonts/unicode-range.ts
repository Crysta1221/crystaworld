/** Unique non-ASCII code points in `value`, sorted ascending. */
export function collectCodes(value: string): number[] {
  const seen = new Set<number>();
  for (const char of value) {
    const code = char.codePointAt(0);
    if (code === undefined || code <= 0x7f || code === 0xfeff) continue;
    seen.add(code);
  }
  return [...seen].sort((a, b) => a - b);
}

export function codesToString(codes: readonly number[]): string {
  let text = "";
  for (let index = 0; index < codes.length; index += 10000) {
    text += String.fromCodePoint(...codes.slice(index, index + 10000));
  }
  return text;
}

/** CSS `unicode-range` value, merging consecutive code points into ranges. */
export function toUnicodeRange(codes: readonly number[]): string {
  const hex = (value: number) => value.toString(16).toUpperCase();
  const parts: string[] = [];
  let index = 0;
  while (index < codes.length) {
    const start = codes[index] ?? 0;
    let end = start;
    while (codes[index + 1] === end + 1) {
      end += 1;
      index += 1;
    }
    parts.push(start === end ? `U+${hex(start)}` : `U+${hex(start)}-${hex(end)}`);
    index += 1;
  }
  return parts.join(", ");
}
