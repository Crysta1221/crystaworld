import { techLogosFor, type TechLogo } from "./tech-logos";

/**
 * Technology marks for a work. Names stay available to assistive tech.
 */
export function WorkTech({ tags }: { tags: readonly string[] }) {
  const logos = techLogosFor(tags);
  if (logos.length === 0) return null;

  return (
    <section aria-labelledby="work-tech-heading">
      <h2
        id="work-tech-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        Tech
      </h2>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-5">
        {logos.map((logo) => (
          <li key={logo.name} className="flex w-16 flex-col items-center gap-1.5 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
              <TechMark logo={logo} />
            </span>
            <span className="text-xs leading-tight text-muted-foreground">{logo.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TechMark({ logo }: { logo: TechLogo }) {
  if (logo.mask) {
    return (
      <span
        aria-hidden
        className={`block bg-foreground ${logo.markClass ?? "size-6"}`}
        style={{
          mask: `url(${logo.src}) center / contain no-repeat`,
          WebkitMask: `url(${logo.src}) center / contain no-repeat`,
        }}
      />
    );
  }

  return <img src={logo.src} alt="" className="size-6 object-contain" />;
}
