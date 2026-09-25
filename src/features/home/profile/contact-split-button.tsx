import { ArrowSquareOutIcon, EnvelopeSimpleIcon, XLogoIcon } from "@phosphor-icons/react";

import { SplitButton, type SplitButtonItem } from "@/shared/components/ui/split-button";

const CONTACT_EMAIL = "mailto:contact@crystaworld.dev";

const CONTACT_ITEMS = [
  {
    label: "XでDMする",
    href: "https://x.com/messages/compose?recipient_id=1678329969905385475",
    target: "_blank",
    icon: <XLogoIcon />,
    endIcon: <ArrowSquareOutIcon />,
  },
] as const satisfies readonly SplitButtonItem[];

/**
 * Contact split button for the Home profile header.
 */
export function ContactSplitButton() {
  return (
    <SplitButton
      size="lg"
      href={CONTACT_EMAIL}
      aria-label="連絡先"
      menuAriaLabel="他の連絡方法"
      icon={<EnvelopeSimpleIcon />}
      items={CONTACT_ITEMS}
      className="w-full sm:w-fit"
    >
      Contact
    </SplitButton>
  );
}
