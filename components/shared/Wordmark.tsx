// Kingsway wordmark — crown + canonical name. Used across public surfaces.
import Link from "next/link";
import { Crown } from "./Crown";

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-fg">
      <span className="text-brass">
        <Crown size={22} />
      </span>
      <span className="font-sans text-lg font-medium tracking-normal">Kingsway</span>
    </Link>
  );
}
