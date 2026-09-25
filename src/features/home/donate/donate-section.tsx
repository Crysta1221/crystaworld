import { useLocale } from "@/features/locale";

import { LinkGroup } from "../group-button/link-group";
import { DONATE_COPY, DONATE_LABEL, DONATE_LINKS } from "./links";

/**
 * Support links, using the same grouped buttons as Socials.
 */
export function Donate() {
  const { locale } = useLocale();

  return (
    <section aria-labelledby="donate-heading">
      <h2
        id="donate-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        {DONATE_LABEL}
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
        {DONATE_COPY[locale]}
      </p>
      <LinkGroup links={DONATE_LINKS} className="mt-4" />
    </section>
  );
}
