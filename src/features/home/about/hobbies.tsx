import { useLocale } from "@/features/locale";

import { HOBBIES } from "./copy";

/**
 * Hobbies section placed after the background timeline.
 * Uses the same tinted pill label and muted body copy.
 */
export function Hobbies() {
  const { locale } = useLocale();
  const copy = HOBBIES[locale];

  return (
    <section aria-labelledby="hobbies-heading">
      <h2
        id="hobbies-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        {HOBBIES.label}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
        <p>{copy.text}</p>
      </div>
    </section>
  );
}
