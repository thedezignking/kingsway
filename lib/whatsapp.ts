// Kingsway — WhatsApp helpers (PRD §4.5). The founder's contact is how Kings connect to see Status.
// NEXT_PUBLIC_FOUNDER_WHATSAPP accepts either a wa.link/wa.me URL or an E.164-ish phone number.

const RAW = process.env.NEXT_PUBLIC_FOUNDER_WHATSAPP || "";
const IS_URL = /^https?:\/\//i.test(RAW);

/** The founder's raw value (URL or number). Prefer whatsappDisplay() for on-screen text. */
export const FOUNDER_WHATSAPP = RAW;

/** True once a real contact is configured (not empty, not the placeholder number). */
export function whatsappConfigured(): boolean {
  return Boolean(RAW) && !RAW.startsWith("+000");
}

/** A working WhatsApp link: the URL as-is, or a wa.me link built from the number's digits. */
export function whatsappLink(): string {
  if (!RAW) return "";
  if (IS_URL) return RAW;
  return `https://wa.me/${RAW.replace(/\D/g, "")}`;
}

/** Friendly label for on-screen text — never a raw URL. */
export function whatsappDisplay(): string {
  return IS_URL ? "Message on WhatsApp" : RAW;
}
