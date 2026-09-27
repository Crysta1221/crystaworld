import { ListIcon, XIcon } from "@phosphor-icons/react";

import { cn } from "@/shared/lib/utils";

interface MenuToggleIconProps {
  open: boolean;
  className?: string;
}

/**
 * Menu mark using the same Phosphor size and weight as the theme and locale icons.
 */
export function MenuToggleIcon({ open, className }: MenuToggleIconProps) {
  const iconClassName =
    "absolute size-[1.15rem] transition-[opacity,transform] duration-200 ease-out";

  return (
    <span className={cn("relative block size-[1.15rem]", className)} aria-hidden>
      <ListIcon className={cn(iconClassName, open ? "scale-90 opacity-0" : "scale-100 opacity-100")} />
      <XIcon className={cn(iconClassName, open ? "scale-100 opacity-100" : "scale-90 opacity-0")} />
    </span>
  );
}
