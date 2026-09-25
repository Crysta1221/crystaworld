import { LinkGroup } from "../group-button/link-group";
import { SOCIAL_LINKS, SOCIALS_LABEL } from "./links";

/**
 * Profile links as one full-width group.
 */
export function Socials() {
  return (
    <section aria-labelledby="socials-heading">
      <h2
        id="socials-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        {SOCIALS_LABEL}
      </h2>
      <LinkGroup links={SOCIAL_LINKS} />
    </section>
  );
}
