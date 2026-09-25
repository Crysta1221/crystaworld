import { ContactSplitButton } from "./contact-split-button";

// Adjust the visible area of the circle avatar: "50% 0%" = top, "50% 100%" = bottom.
const AVATAR_POSITION = "50% 22%";

/**
 * Left-aligned profile header with avatar, name and role.
 * On mobile the Contact action wraps below as a full-width control.
 */
export function ProfileHeader() {
  return (
    <section
      aria-label="プロフィール"
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
    >
      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
        <img
          src="/images/crysta-avatar.jpeg"
          alt="Crysta Avatar"
          width={80}
          height={80}
          style={{ objectPosition: AVATAR_POSITION }}
          className="size-16 shrink-0 rounded-full bg-muted object-cover sm:size-20"
        />
        <div className="min-w-0 text-left">
          <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            くりすた
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            <span className="whitespace-nowrap">Kosen Student (B3)</span>
            {" | "}
            <span className="whitespace-nowrap">Web Engineer</span>
            {" | "}
            <span className="whitespace-nowrap">Designer</span>
          </p>
        </div>
      </div>
      <ContactSplitButton />
    </section>
  );
}
