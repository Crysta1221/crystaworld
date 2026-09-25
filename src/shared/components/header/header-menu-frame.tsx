import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface HeaderMenuFrameProps {
  children: ReactNode;
  className?: string;
}

/**
  Capsule frame container for header items (menu pill, buttons).
 */
export function HeaderMenuFrame({ children, className }: HeaderMenuFrameProps) {
  return (
    <div
      className={cn(
        "pointer-events-auto flex h-14 items-center gap-1.5 rounded-full border-2 border-dashed border-border/80 bg-card/85 px-3 backdrop-blur-md shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}
