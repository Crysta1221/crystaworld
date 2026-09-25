import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface AppContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared horizontal container for header and main content.
 * Keeps the same gutters on mobile / tablet / desktop.
 */
export function AppContainer({ children, className }: AppContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
