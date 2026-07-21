// Landing footer — calm and minimal, matching the Brass & Ink identity. Wordmark + a one-line brand
// statement, only-configured social links (lib/social.ts), legal links, and a quiet © line. No
// sprawling sitemap — Kingsway is deliberately not a social network.
import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { socialLinks } from "@/lib/social";
import { BRAND_LINE_DISPLAY } from "@/lib/brand";

export function Footer() {
  const socials = socialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8">
      <div className="hairline" />
      <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex max-w-xs flex-col gap-3">
          <Wordmark />
          <p className="text-sm leading-relaxed text-muted">
            A growth community for builders. Last Sunday, every month.
          </p>
        </div>

        <nav className="flex gap-12 font-mono text-xs" aria-label="Footer">
          {socials.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <span className="text-muted/70">Connect</span>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noopener noreferrer" : undefined}
                  className="text-muted transition hover:text-brass"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            <span className="text-muted/70">Kingsway</span>
            <Link href="/privacy" className="text-muted transition hover:text-brass">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted transition hover:text-brass">
              Terms
            </Link>
          </div>
        </nav>
      </div>

      <div className="flex items-center justify-between border-t border-line py-5 font-mono text-xs text-muted">
        <span>© {year} Kingsway</span>
        <span>{BRAND_LINE_DISPLAY}</span>
      </div>
    </footer>
  );
}
