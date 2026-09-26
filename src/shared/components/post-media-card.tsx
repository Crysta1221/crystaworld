import { CalendarBlankIcon } from "@phosphor-icons/react";

import { formatYearMonth } from "@/features/locale";

type PostMediaCardProps = {
  imageSrc: string;
  title: string;
  /** `YYYY-MM` or `YYYY-MM-DD`. */
  date: string;
  tags: readonly string[];
  body: string;
};

/**
 * Vertical index card. The Open Graph image keeps its 1200×630 frame above the copy.
 */
export function PostMediaCard({ imageSrc, title, date, tags, body }: PostMediaCardProps) {
  const excerpt = firstParagraph(body);

  return (
    <>
      <div className="relative aspect-1200/630 w-full overflow-hidden rounded-lg bg-background">
        <img
          src={imageSrc}
          alt=""
          className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-1 pt-2.5">
        <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground">{title}</h2>
        {excerpt ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{excerpt}</p>
        ) : null}
        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground">
          <CalendarBlankIcon className="size-3.5 shrink-0" />
          {formatYearMonth(date, "ja")}
        </p>
      </div>
    </>
  );
}

function firstParagraph(body: string): string {
  const paragraph = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block.length > 0 && !block.startsWith("#") && !block.startsWith(">") && !block.startsWith("```"));

  if (!paragraph) return "";
  return paragraph.replace(/\s+/g, " ");
}
