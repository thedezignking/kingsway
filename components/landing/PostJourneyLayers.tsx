"use client";

import { useEffect, useRef, useState } from "react";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";

export function PostJourneyLayers() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const nextLayer = progress < 0.68 ? 0 : 1;
      const nextReady = rect.top <= 2;
      setActiveLayer((current) => (current === nextLayer ? current : nextLayer));
      setIsReady((current) => (current === nextReady ? current : nextReady));
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="post-layers"
      data-ready={isReady ? "true" : "false"}
      aria-label="Kingsway next steps"
    >
      <div className="post-layers__stage">
        <span className="post-layers__way" aria-hidden="true" />
        <div
          className="post-layer"
          data-state={activeLayer === 0 ? "active" : "previous"}
          aria-hidden={activeLayer !== 0}
        >
          <FAQ />
        </div>
        <div
          className="post-layer"
          data-state={activeLayer === 1 ? "active" : "hidden"}
          aria-hidden={activeLayer !== 1}
        >
          <FinalCTA />
        </div>
      </div>
      <noscript>
        <style>{`
          .post-layers {
            min-height: auto !important;
          }
          .post-layers__stage {
            position: static !important;
            min-height: auto !important;
            overflow: visible !important;
          }
          .post-layer {
            position: relative !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: none !important;
            visibility: visible !important;
          }
        `}</style>
      </noscript>
    </section>
  );
}
