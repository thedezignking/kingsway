"use client";

import { useEffect, useRef, useState } from "react";
import { AnalyticsEvent, track } from "@/lib/analytics/events";

const SCENES = [
  {
    id: "recognition",
    eyebrow: "The part no one sees",
    title: "Building can get quiet.",
    body: "There is always another video, thread or book to consume. But information does not always answer the questions that show up when it is time to do the work.",
    questions: [
      "Am I building the right thing?",
      "Why does this feel harder than it should?",
      "Who can I say that to without pretending?",
    ],
  },
  {
    id: "kingshour",
    eyebrow: "Once a month",
    title: "Bring the month as it really was.",
    body: "On the last Sunday of every month, we gather online for KingsHour. We talk about what we tried, where we got stuck, what changed, and what we are carrying into the next month. Then we return to the work.",
    facts: ["Last Sunday", "Online", "Honest conversation"],
  },
  {
    id: "census",
    eyebrow: "Before KingsHour",
    title: "First, we listen.",
    body: "The King’s Census is our first conversation with you. It is not an application or a test. It gives us a clearer picture of the people in the room—their seasons, ambitions, questions and realities—before we gather.",
  },
] as const;

export function ScrollJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeLineRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewed = useRef(new Set<number>());

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      const nextIndex = Math.min(SCENES.length - 1, Math.floor(progress * SCENES.length));

      if (activeLineRef.current) {
        activeLineRef.current.style.transform = `scaleY(${progress})`;
      }

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      if (!viewed.current.has(nextIndex) && progress > 0) {
        viewed.current.add(nextIndex);
        track(AnalyticsEvent.LANDING_SCROLL_DEPTH, {
          scene: SCENES[nextIndex].id,
          depth: Math.round(progress * 100),
        });
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="journey-enhanced" aria-label="How Kingsway works">
        <div className="journey-stage">
          <div className="journey-line" aria-hidden="true">
            <span ref={activeLineRef} className="journey-line__active" />
          </div>

          {SCENES.map((scene, index) => {
            const state = index === activeIndex ? "active" : index === activeIndex - 1 ? "previous" : "hidden";
            return (
              <article
                key={scene.id}
                className={`journey-scene journey-scene--${index + 1}`}
                data-state={state}
              >
                <span className="journey-node" aria-hidden="true" />
                <div className="journey-scene__copy">
                  <p className="journey-kicker">{scene.eyebrow}</p>
                  <h2>{scene.title}</h2>
                  <p>{scene.body}</p>
                  {"questions" in scene && (
                    <div className="journey-questions">
                      {scene.questions.map((question) => <span key={question}>{question}</span>)}
                    </div>
                  )}
                  {"facts" in scene && (
                    <div className="journey-facts" aria-label="KingsHour details">
                      {scene.facts.map((fact) => <span key={fact}>{fact}</span>)}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <noscript>
        <style>{`
          .journey-enhanced{height:auto!important;margin:1rem auto 4rem;padding:0 1.5rem}
          .journey-enhanced .journey-stage{position:relative;height:auto;overflow:visible}
          .journey-enhanced .journey-line{display:none}
          .journey-enhanced .journey-scene{position:relative;top:auto;margin-left:1.1rem;padding:3.5rem 0 3.5rem 3rem;border-left:1px dotted var(--line);opacity:1;transform:none}
          .journey-enhanced .journey-node{top:4rem;left:-.35rem;background:var(--accent)}
          .journey-enhanced .journey-scene__copy{width:auto;max-width:42rem;margin:0}
          .journey-enhanced .journey-scene[data-state="previous"] .journey-kicker,.journey-enhanced .journey-scene[data-state="previous"] .journey-scene__copy>p,.journey-enhanced .journey-scene[data-state="previous"] .journey-questions,.journey-enhanced .journey-scene[data-state="previous"] .journey-facts{opacity:1!important}
          .journey-enhanced .journey-scene[data-state="previous"] h2{max-width:none;font-size:clamp(1.8rem,9vw,2.5rem)}
        `}</style>
      </noscript>
    </>
  );
}
