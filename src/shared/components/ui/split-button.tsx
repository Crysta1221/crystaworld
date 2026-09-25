import type { ComponentProps, ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

import { Button } from "@/shared/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@/shared/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

type ButtonSize = NonNullable<ComponentProps<typeof Button>["size"]>;
type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>;

type SplitButtonSize = "xs" | "sm" | "default" | "lg";

const CHEVRON_SIZE = {
  xs: "icon-xs",
  sm: "icon-sm",
  default: "icon",
  lg: "icon-lg",
} as const satisfies Record<SplitButtonSize, ButtonSize>;

/** M3 Expressive Small: 16/12. Avoid translate hacks that shift with label length. */
const LEADING_PADDING = {
  xs: "pl-3! pr-2.5!",
  sm: "pl-3! pr-2.5!",
  default: "pl-4! pr-3!",
  lg: "pl-4! pr-3!",
} as const satisfies Record<SplitButtonSize, string>;

export type SplitButtonItem = {
  label: string;
  href?: string;
  icon?: ReactNode;
  endIcon?: ReactNode;
  target?: "_blank";
};

export type SplitButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  items: readonly SplitButtonItem[];
  size?: SplitButtonSize;
  variant?: ButtonVariant;
  className?: string;
  "aria-label"?: string;
  menuAriaLabel?: string;
};

/**
 * Connected split button: primary action on the left, extra actions in a menu.
 */
export function SplitButton({
  children,
  icon,
  href,
  items,
  size = "default",
  variant = "default",
  className,
  "aria-label": ariaLabel,
  menuAriaLabel = "その他の操作",
}: SplitButtonProps) {
  const isPrimary = variant === "default";

  return (
    <ButtonGroup aria-label={ariaLabel} className={cn("shrink-0", className)}>
      <Button
        size={size}
        variant={variant}
        className={cn("min-w-0 flex-1 rounded-r-none!", LEADING_PADDING[size])}
        nativeButton={href ? false : undefined}
        render={href ? <a href={href} /> : undefined}
      >
        {icon}
        {children}
      </Button>
      <ButtonGroupSeparator
        className={cn("my-0!", isPrimary && "bg-primary-foreground/40")}
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              size={CHEVRON_SIZE[size]}
              variant={variant}
              className="rounded-l-none! pl-2 pr-3"
              aria-label={menuAriaLabel}
            />
          }
        >
          <CaretDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          {items.map((item) => (
            <SplitButtonMenuItem key={item.label} item={item} />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

function SplitButtonMenuItem({ item }: { item: SplitButtonItem }) {
  const isExternal = item.target === "_blank";

  return (
    <DropdownMenuItem
      nativeButton={item.href ? false : undefined}
      render={
        item.href ? (
          <a
            href={item.href}
            target={item.target}
            rel={isExternal ? "noopener noreferrer" : undefined}
          />
        ) : undefined
      }
    >
      {item.icon}
      <span className="leading-none">{item.label}</span>
      {item.endIcon ? (
        <span className="ml-auto inline-flex size-4 shrink-0 items-center justify-center self-center -translate-y-px [&>svg]:block">
          {item.endIcon}
        </span>
      ) : null}
    </DropdownMenuItem>
  );
}
