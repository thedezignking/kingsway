// Kingsway wordmark — crown + name in the display face. Used on member-facing surfaces.
import Link from "next/link";
import { Crown } from "./Crown";

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-fg">
      <span className="text-brass">
        <Crown size={22} />
      </span>
      <span className="font-display text-lg font-medium tracking-tight">Kingsway</span>
    </Link>
  );
}
