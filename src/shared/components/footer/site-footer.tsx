import { Link } from "@tanstack/react-router";

import { SOCIAL_LINKS } from "@/features/home/socials/links";
import { AppContainer } from "@/shared/components/layout";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Works", to: "/works" },
  { label: "Blogs", to: "/blogs" },
  { label: "Memos", to: "/memos" },
] as const;

const FOOTER_SOCIAL_IDS = ["x", "github"] as const;

const CREDIT_LINK_CLASS =
  "text-foreground/80 underline underline-offset-4 outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50";

/**
 * Site footer. The menu lines up with the credit lines, and X / GitHub stay at the lower right.
 */
export function SiteFooter() {
  const socials = FOOTER_SOCIAL_IDS.map((id) => SOCIAL_LINKS.find((link) => link.id === id)).filter(
    (link) => link !== undefined,
  );

  return (
    <footer className="pt-16">
      <AppContainer className="pb-8">
        <div className="border-t border-border" />
        <div className="pt-10">
          <Link
            to="/"
            aria-label="Crysta"
            className="inline-flex rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <img
              src="/images/logo_kurofuti.webp"
              alt=""
              width={87}
              height={40}
              loading="lazy"
              decoding="async"
              className="h-10 w-[87px] dark:hidden"
            />
            <img
              src="/images/logo_futi.webp"
              alt=""
              width={87}
              height={40}
              loading="lazy"
              decoding="async"
              className="hidden h-10 w-[87px] dark:block"
            />
          </Link>

          <div className="mt-4 flex items-start gap-16 sm:gap-24">
            <p className="text-sm leading-6 text-foreground/70">
              Logos by{" "}
              <a
                href="https://x.com/kisaki_eria"
                target="_blank"
                rel="noopener noreferrer"
                className={CREDIT_LINK_CLASS}
              >
                @kisaki_eria
              </a>
              <br />
              Illust by{" "}
              <a
                href="https://x.com/gom4ty0"
                target="_blank"
                rel="noopener noreferrer"
                className={CREDIT_LINK_CLASS}
              >
                @gom4ty0
              </a>
            </p>

            <nav aria-label="Footer">
              <p className="text-sm font-semibold text-foreground">Menu</p>
              <ul className="mt-4 flex flex-col items-start gap-3">
                {FOOTER_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6">
            <p className="text-sm text-foreground/70">© 2026 Crystaworld</p>
            <ul className="flex items-center gap-4">
              {socials.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="inline-flex rounded-md text-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <span
                      aria-hidden
                      className="block size-5 bg-current"
                      style={{
                        mask: `url(${link.icon}) center / contain no-repeat`,
                        WebkitMask: `url(${link.icon}) center / contain no-repeat`,
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AppContainer>
    </footer>
  );
}
