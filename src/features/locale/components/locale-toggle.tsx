import { TranslateIcon } from "@phosphor-icons/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";

import type { Locale } from "../lib/locale";
import { useLocale } from "./locale-provider";

type LocaleToggleProps = {
  className?: string;
};

const LOCALES = [
  { value: "ja", label: "日本語", flag: "/flags/jp.svg" },
  { value: "en", label: "English", flag: "/flags/us.svg" },
] as const satisfies readonly {
  value: Locale;
  label: string;
  flag: string;
}[];

function isLocale(value: unknown): value is Locale {
  return value === "ja" || value === "en";
}

/**
 * Opens a language menu from the Phosphor translate icon.
 * Japanese is listed first, then English. The active locale shows a check.
 */
export function LocaleToggle({ className }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={locale === "ja" ? "言語" : "Language"}
        className={cn(
          "inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none data-popup-open:bg-accent data-popup-open:text-foreground",
          className,
        )}
      >
        <TranslateIcon className="size-[1.15rem]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8}>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            if (isLocale(value)) setLocale(value);
          }}
        >
          {LOCALES.map((item) => (
            <DropdownMenuRadioItem
              key={item.value}
              value={item.value}
              closeOnClick
              className="cursor-pointer"
            >
              <img
                src={item.flag}
                alt=""
                width={22}
                height={16}
                className="h-4 w-[1.35rem] shrink-0 rounded-[2px] object-cover ring-1 ring-foreground/15"
              />
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
