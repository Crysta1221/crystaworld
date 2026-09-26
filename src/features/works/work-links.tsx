import { ArrowUpRightIcon } from "@phosphor-icons/react";

import { Button } from "@/shared/components/ui/button";

import type { WorkLink } from "./catalog";

/**
 * External links for a work. Each entry is a button authored in the CMS.
 */
export function WorkLinks({ links }: { links: readonly WorkLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {links.map((link) => (
        <Button
          key={`${link.label}\0${link.url}`}
          variant="secondary"
          size="sm"
          className="h-auto px-5 py-2"
          nativeButton={false}
          render={<a href={link.url} target="_blank" rel="noopener noreferrer" />}
        >
          {link.label}
          <ArrowUpRightIcon />
        </Button>
      ))}
    </div>
  );
}
