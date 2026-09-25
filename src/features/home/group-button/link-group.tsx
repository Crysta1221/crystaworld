import { cn } from "@/shared/lib/utils";

export type GroupLink = {
  id: string;
  name: string;
  href: string;
  icon: string;
};

const ROW_SIZE = 4;

const COLUMN_CLASS = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
} as const;

/**
 * Full-width link row. Outer ends stay semicircular until hover, then the
 * hovered button becomes a pill. Leaving hover snaps the shape back.
 * Narrow screens, and links past the first four, stack as separate pills.
 */
export function LinkGroup({ links, className }: { links: readonly GroupLink[]; className?: string }) {
  const row = links.slice(0, ROW_SIZE);
  const rest = links.slice(ROW_SIZE);

  return (
    <div className={cn("mt-6 flex flex-col gap-2", className)}>
      <LinkRow links={row} />
      {rest.length > 0 ? <LinkRow links={rest} stacked /> : null}
    </div>
  );
}

function LinkRow({ links, stacked = false }: { links: readonly GroupLink[]; stacked?: boolean }) {
  const columns = COLUMN_CLASS[links.length as keyof typeof COLUMN_CLASS] ?? COLUMN_CLASS[4];

  return (
    <ul className={cn("grid w-full grid-cols-1 gap-2", !stacked && cn("sm:gap-[3px]", columns))}>
      {links.map((link, index) => (
        <li key={link.id} className="flex min-w-0">
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "flex h-12 w-full min-w-0 items-center justify-center gap-2 bg-secondary px-3 text-[15px] font-medium text-foreground",
              "transition-[border-radius,background-color,transform] duration-0 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              "hover:rounded-full hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_8%)] hover:duration-300",
              "focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:duration-300",
              "active:scale-[0.97]",
              cornerClass(index, links.length, stacked),
            )}
          >
            <GroupMark src={link.icon} />
            <span className="truncate">{link.name}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function cornerClass(index: number, count: number, stacked: boolean) {
  if (count === 1 || stacked) return "rounded-full";

  const start = index === 0;
  const end = index === count - 1;

  return cn(
    "rounded-full",
    !start && !end && "sm:rounded-[10px]",
    start && "sm:rounded-[24px_10px_10px_24px]",
    end && !start && "sm:rounded-[10px_24px_24px_10px]",
  );
}

function GroupMark({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="block size-4 shrink-0 bg-current"
      style={{
        mask: `url(${src}) center / contain no-repeat`,
        WebkitMask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}
