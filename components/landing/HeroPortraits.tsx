import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import type { CSSProperties } from "react";
import { Crown } from "@/components/shared/Crown";

const PORTRAITS = Array.from({ length: 5 }, (_, index) => {
  const filename = `king-0${index + 1}.jpg`;
  return {
    filename,
    src: `/images/kings/hero/${filename}`,
    available: existsSync(path.join(process.cwd(), "public", "images", "kings", "hero", filename)),
  };
});

export function HeroPortraits() {
  return (
    <figure className="hero-community" aria-labelledby="hero-community-caption">
      <div className="hero-community__cluster" aria-label="Kings in the Kingsway community">
        {PORTRAITS.map((portrait, index) => (
          <div
            key={portrait.filename}
            className={`hero-community__portrait hero-community__portrait--${index + 1}`}
            style={{ "--portrait-order": index } as CSSProperties}
          >
            {portrait.available ? (
              <Image
                src={portrait.src}
                alt=""
                fill
                sizes="(max-width: 640px) 24vw, 150px"
                className="object-cover"
                priority={index < 3}
              />
            ) : (
              <span className="hero-community__placeholder" aria-hidden="true">
                <Crown size={22} />
              </span>
            )}
          </div>
        ))}

        <div className="hero-community__centre">
          <span className="hero-community__crown" aria-hidden="true">
            <Crown size={35} />
          </span>
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
            KingsHour
          </span>
          <span className="max-w-40 text-balance text-sm leading-snug text-fg">
            One honest conversation, once a month.
          </span>
        </div>

        <span className="hero-community__stem" aria-hidden="true" />
      </div>

      <figcaption id="hero-community-caption" className="hero-community__proof">
        <span>Join young builders from</span>
        <span className="hero-community__cities">
          <span><span aria-hidden="true">🇳🇬</span> Lagos</span>
          <span><span aria-hidden="true">🇬🇭</span> Accra</span>
          <span><span aria-hidden="true">🇰🇪</span> Nairobi</span>
          <span><span aria-hidden="true">🇬🇧</span> London</span>
        </span>
      </figcaption>
    </figure>
  );
}
