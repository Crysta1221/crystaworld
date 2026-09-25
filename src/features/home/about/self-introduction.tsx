import { useLocale } from "@/features/locale";

import { SELF_INTRODUCTION } from "./copy";

/**
 * Short self-introduction under the profile header.
 * The label is a tinted pill; the copy stays in the muted body color.
 */
export function SelfIntroduction() {
  const { locale } = useLocale();
  const copy = SELF_INTRODUCTION[locale];

  return (
    <section aria-labelledby="self-introduction-heading">
      <h2
        id="self-introduction-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        {SELF_INTRODUCTION.label}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
        <p>
          {copy.lead}
          <br />
          {copy.rest}
        </p>
      </div>
    </section>
  );
}
