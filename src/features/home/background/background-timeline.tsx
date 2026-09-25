import { formatYearMonth, useLocale } from "@/features/locale";

import { BACKGROUND_EVENTS } from "./events";

const MIDDLE_DOT =
  "color-mix(in oklab, var(--muted-foreground) 35%, var(--background))";

/**
 * Rail segment from this row's center through the gap to the next row.
 * First and last segments stop at the endpoint dots so the line does not stick out.
 */
function railClass(index: number, lastIndex: number) {
  const shared = "absolute left-1/2 w-0.5 -translate-x-1/2 bg-border";

  if (lastIndex === 0) {
    return "hidden";
  }

  if (index === 0) {
    return `${shared} top-1/2 -bottom-5`;
  }

  if (index === lastIndex) {
    return `${shared} -top-5 bottom-1/2`;
  }

  return `${shared} -top-5 -bottom-5`;
}

/**
 * Career timeline under About Me.
 * The label matches the About Me pill; entries run newest first.
 */
export function BackgroundTimeline() {
  const { locale } = useLocale();
  const lastIndex = BACKGROUND_EVENTS.length - 1;

  return (
    <section aria-labelledby="background-heading">
      <h2
        id="background-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        Background
      </h2>
      <ol className="mt-6 flex flex-col gap-5">
        {BACKGROUND_EVENTS.map((event, index) => {
          const isTerminal = index === 0 || index === lastIndex;

          return (
            <li key={event.dateTime} className="flex items-center gap-x-4 sm:gap-x-6">
              <span className="relative flex w-3 shrink-0 items-center justify-center self-stretch">
                <span aria-hidden className={railClass(index, lastIndex)} />
                <span
                  aria-hidden
                  className="relative z-10 size-3 shrink-0 rounded-full bg-primary"
                  style={isTerminal ? undefined : { backgroundColor: MIDDLE_DOT }}
                />
              </span>
              <time
                dateTime={event.dateTime}
                className="w-24 shrink-0 text-sm leading-6 whitespace-nowrap text-muted-foreground tabular-nums"
              >
                {formatYearMonth(event.dateTime, locale)}
              </time>
              <p className="min-w-0 flex-1 text-sm leading-6 text-foreground/80 sm:text-base sm:leading-7">
                {event.text[locale]}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
