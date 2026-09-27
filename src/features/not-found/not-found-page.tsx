import { useEffect } from "react";
import { HouseIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { useLocale } from "@/features/locale";
import { PageHero } from "@/shared/components/page-hero";
import { Button } from "@/shared/components/ui/button";

import { NOT_FOUND_COPY } from "./copy";

/**
 * Shown for unknown URLs and for works, blogs, or memos that do not exist.
 * Same frame as the section index pages: the page hero, then the copy.
 */
export function NotFoundPage() {
  const { locale } = useLocale();
  const copy = NOT_FOUND_COPY[locale];

  useEffect(() => {
    document.title = "404 | Crystaworld";
    return () => {
      document.title = "Crystaworld";
    };
  }, []);

  return (
    <div>
      {/* React hoists this into <head>; missing pages should not be indexed. */}
      <meta name="robots" content="noindex" />
      <div className="slide-enter">
        <PageHero pattern="diamond" title="404" />
      </div>
      <section className="slide-enter flex flex-col items-start gap-4 py-8 sm:py-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{copy.heading}</h2>
        <p className="text-sm leading-7 text-muted-foreground sm:text-base">{copy.body}</p>
        <Button
          variant="secondary"
          className="mt-2 h-auto px-5 py-2"
          nativeButton={false}
          render={<Link to="/" />}
        >
          <HouseIcon />
          {copy.home}
        </Button>
      </section>
    </div>
  );
}
