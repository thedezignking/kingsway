// Scroll-reveal wrapper — fades/rises its children in once as they enter the viewport. Calm and
// one-shot (disconnects after firing). Reduced motion is handled in globals.css (.reveal override).
"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
  rootMargin = "0px 0px -8% 0px",
  threshold = 0.12,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  rootMargin?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, threshold]);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
