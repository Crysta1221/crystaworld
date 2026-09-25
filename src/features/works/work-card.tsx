import { Link } from "@tanstack/react-router";

import type { Work } from "./catalog";

/**
 * Image-led work card. The title sits on the picture and opens the detail page.
 */
export function WorkCard({ work }: { work: Work }) {
  return (
    <Link
      to="/works/$workId"
      params={{ workId: work.id }}
      className="group relative block aspect-video overflow-hidden rounded-2xl bg-muted outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <img
        src={work.image}
        alt=""
        className="size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
      <p className="absolute inset-x-0 bottom-0 px-3.5 pb-3 text-sm leading-snug font-medium text-white">
        {work.title}
      </p>
    </Link>
  );
}
