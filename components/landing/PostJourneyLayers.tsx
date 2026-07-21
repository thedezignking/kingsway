"use client";

import { useEffect, useRef, useState } from "react";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";

function PostReveal({
  children,
  className = "",
  delay = 0,
  trigger = 0.42,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  trigger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const top = el.getBoundingClientRect().top;
      if (top <= window.innerHeight * trigger) {
        setShown(true);
        window.removeEventListener("scroll", requestUpdate);
        window.removeEventListener("resize", requestUpdate);
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [shown, trigger]);

  return (
    <div
      ref={ref}
      className={`post-reveal ${shown ? "post-reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function PostJourneyLayers() {
  return (
    <section className="post-layers" aria-label="Kingsway next steps">
      <PostReveal className="post-layer" trigger={0.42}>
        <FAQ />
      </PostReveal>
      <PostReveal className="post-layer post-layer--cta" delay={120} trigger={0.52}>
        <FinalCTA />
      </PostReveal>
    </section>
  );
}
