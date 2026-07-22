"use client";

import { useEffect, useRef, useState } from "react";
import { AnalyticsEvent, track } from "@/lib/analytics/events";

const SCENES = [
  {
    id: "recognition",
    eyebrow: "The real work",
    title: "You are building something. It can get heavy.",
    body: "There is the work people can see, and there is the part you carry quietly: the doubt, the pressure, the drift, the month that did not go as planned. Kingsway makes room for that honesty.",
    questions: [
      "What are you building right now?",
      "What has made it harder lately?",
      "What do you need to say honestly?",
    ],
  },
  {
    id: "kingshour",
    eyebrow: "KingsHour",
    title: "Once a month, we bring the month into the room.",
    body: "KingsHour happens online on the last Sunday of the month. We talk about what we tried, what felt heavy, what shifted, and what each person is carrying back into the work.",
    facts: ["Last Sunday", "Online", "One honest conversation"],
  },
  {
    id: "census",
    eyebrow: "The King's Census",
    title: "Before we gather, we listen.",
    body: "The King's Census is our first conversation with you. A few thoughtful questions help us understand who is here, what each person is building, and what kind of room KingsHour needs to hold.",
  },
] as const;

export function ScrollJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeLineRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewed = useRef(new Set<number>());
  const previousScene = activeIndex > 0 ? SCENES[activeIndex - 1] : null;

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      // On phones, hold the middle conversation long enough to read and bring the final scene in
      // late enough that it hands into the FAQ without an extra unchanged-scroll stretch.
      const mobile = window.innerWidth <= 700;
      let nextIndex: number;
      let interactionProgress = progress;
      if (mobile) {
        if (progress >= 0.76) nextIndex = 2;
        else if (progress >= 0.34) nextIndex = 1;
        else nextIndex = 0;
      } else {
        // Desktop scene one becomes visible while the section is entering the viewport. Count that
        // entrance distance as part of the journey, then divide the full visible travel into three
        // equal windows. This keeps the perceived dwell time equal—not merely the sticky portion.
        const firstScene = section.querySelector<HTMLElement>(".journey-scene--1");
        const entranceDistance = Math.max(window.innerHeight - (firstScene?.offsetTop ?? 0), 0);
        const visibleTravel = Math.min(
          entranceDistance + scrollable,
          Math.max(0, entranceDistance - rect.top),
        );
        interactionProgress = visibleTravel / Math.max(entranceDistance + scrollable, 1);
        nextIndex = Math.min(
          SCENES.length - 1,
          Math.floor(interactionProgress * SCENES.length),
        );
      }

      if (activeLineRef.current) {
        activeLineRef.current.style.transform = `scaleY(${interactionProgress})`;
      }

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      if (!viewed.current.has(nextIndex) && interactionProgress > 0) {
        viewed.current.add(nextIndex);
        track(AnalyticsEvent.LANDING_SCROLL_DEPTH, {
          scene: SCENES[nextIndex].id,
          depth: Math.round(interactionProgress * 100),
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

          <p className="journey-previous-title" aria-hidden="true">
            {previousScene?.title}
          </p>

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
          .journey-enhanced .journey-line,.journey-enhanced .journey-previous-title{display:none}
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
