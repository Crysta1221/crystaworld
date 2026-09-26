import { tagFor, type WorkTag } from "./tag-catalog";

/**
 * Technology marks for a work. Names stay available to assistive tech.
 */
export function WorkTech({ tags }: { tags: readonly string[] }) {
  if (tags.length === 0) return null;

  return (
    <section aria-labelledby="work-tech-heading">
      <h2
        id="work-tech-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        Tech
      </h2>
      <ul className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(6.75rem,6.75rem))] gap-x-3 gap-y-5">
        {tags.map((name) => (
          <li key={name} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
            <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
              <TechMark tag={tagFor(name)} />
            </span>
            <span className="w-full text-xs leading-tight text-balance text-muted-foreground">{name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TechMark({ tag }: { tag: WorkTag | undefined }) {
  if (!tag?.icon) return null;

  if (tag.mask) {
    return (
      <span
        aria-hidden
        className={`block bg-foreground ${tag.wide ? "h-5 w-10" : "size-6"}`}
        style={{
          mask: `url(${tag.icon}) center / contain no-repeat`,
          WebkitMask: `url(${tag.icon}) center / contain no-repeat`,
        }}
      />
    );
  }

  return <img src={tag.icon} alt="" className="size-6 object-contain" />;
}
