// Kingsway — social / contact links for the footer. URLs come from env so they're easy to set and
// no dead links ship: a channel only renders once its URL is configured. WhatsApp is always on
// (built from the founder's number). Fill NEXT_PUBLIC_SUBSTACK_URL / NEXT_PUBLIC_X_URL to light up
// those links.
import { whatsappLink, whatsappConfigured } from "./whatsapp";

export interface SocialLink {
  label: string;
  href: string;
  external: boolean;
}

/** Only returns channels that are actually configured — never a placeholder/dead link. */
export function socialLinks(): SocialLink[] {
  const links: SocialLink[] = [];

  // WhatsApp is live once a real contact is configured; hidden while it's the placeholder.
  if (whatsappConfigured()) {
    links.push({ label: "WhatsApp", href: whatsappLink(), external: true });
  }
  const substack = process.env.NEXT_PUBLIC_SUBSTACK_URL;
  if (substack) links.push({ label: "Substack", href: substack, external: true });

  const x = process.env.NEXT_PUBLIC_X_URL;
  if (x) links.push({ label: "X", href: x, external: true });

  return links;
}
