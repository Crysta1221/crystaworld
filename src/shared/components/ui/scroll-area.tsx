import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";

import { cn } from "@/shared/lib/utils";

export interface ScrollAreaProps extends ScrollAreaPrimitive.Root.Props {
  orientation?: "vertical" | "horizontal" | "both";
  viewportClassName?: string;
  contentClassName?: string;
}

function ScrollArea({
  className,
  children,
  orientation = "vertical",
  viewportClassName,
  contentClassName,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative flex flex-col overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full min-h-0 min-w-0 flex-1 rounded-[inherit] outline-none",
          viewportClassName,
        )}
      >
        <ScrollAreaPrimitive.Content
          data-slot="scroll-area-content"
          className={cn("w-full min-w-full", contentClassName)}
        >
          {children}
        </ScrollAreaPrimitive.Content>
      </ScrollAreaPrimitive.Viewport>
      {(orientation === "vertical" || orientation === "both") && (
        <ScrollBar orientation="vertical" />
      )}
      {(orientation === "horizontal" || orientation === "both") && (
        <ScrollBar orientation="horizontal" />
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  const isHorizontal = orientation === "horizontal";

  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "z-20 flex touch-none p-0.5 transition-opacity select-none",
        isHorizontal
          ? "h-2.5 flex-col border-t border-t-transparent hover:bg-foreground/5"
          : "w-2.5 border-l border-l-transparent hover:bg-foreground/5",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "rounded-full bg-border/80 transition-colors hover:bg-muted-foreground",
          isHorizontal ? "h-full" : "w-full",
        )}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollBar };
