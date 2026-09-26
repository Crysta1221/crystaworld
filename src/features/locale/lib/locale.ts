export type Locale = "ja" | "en";

const EN_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function isLocale(value: string | null): value is Locale {
  return value === "ja" || value === "en";
}

function detectLocale(): Locale {
  try {
    return navigator.language.toLowerCase().startsWith("en") ? "en" : "ja";
  } catch {
    return "ja";
  }
}

// Read the persisted locale without throwing in restricted contexts.
export function getStoredLocale(storageKey: string): Locale {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return isLocale(stored) ? stored : detectLocale();
  } catch {
    return "ja";
  }
}

// `2026-09` becomes `2026年9月`. `2026-09-26` becomes `2026年9月26日`.
export function formatYearMonth(value: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
  if (!match) return value;

  const year = match[1];
  const month = Number(match[2]);
  const day = match[3] ? Number(match[3]) : undefined;
  const monthName = EN_MONTHS[month - 1];
  if (!year || !monthName || (day !== undefined && (day < 1 || day > 31))) return value;

  if (locale === "ja") return day ? `${year}年${month}月${day}日` : `${year}年${month}月`;
  return day ? `${year} ${monthName} ${day}` : `${year} ${monthName}`;
}

export function applyLocale(locale: Locale): void {
  document.documentElement.lang = locale;
}
