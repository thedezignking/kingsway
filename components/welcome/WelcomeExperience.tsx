// Welcome Experience: the first moment of belonging, not a confirmation page.
"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { loadKingName } from "@/lib/census/storage";
import { buildIcs } from "@/lib/email/ics";
import { nextKingsHour } from "@/lib/kingshour/schedule";
import { track, AnalyticsEvent } from "@/lib/analytics/events";
import { whatsappDisplay, whatsappLink } from "@/lib/whatsapp";
import { Crown } from "@/components/shared/Crown";

export function WelcomeExperience() {
  const [name, setName] = useState<string | null>(null);
  const [nextDate, setNextDate] = useState<string>("");

  useEffect(() => {
    setName(loadKingName());
    const d = nextKingsHour();
    setNextDate(
      d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
    );
    track(AnalyticsEvent.WELCOME_VIEW);
  }, []);

  function addToCalendar() {
    const start = nextKingsHour();
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const ics = buildIcs({
      uid: `kingshour-${start.toISOString().slice(0, 10)}@kingsway`,
      title: "KingsHour",
      description: "The monthly Kingsway gathering. Link to follow by email.",
      start,
      end,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kingshour.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="welcome-experience">
      <header className="welcome-arrival">
        <div className="welcome-arrival__mark anim-crown">
          <Crown size={36} />
        </div>
        <p className="eyebrow text-brass">Welcome to Kingsway</p>
        <h1 className="mt-4 max-w-xl text-balance font-sans text-4xl font-medium leading-[1.08] tracking-[-0.015em] sm:text-5xl">
          {name ? `Welcome home, ${name}.` : "Welcome home."}
        </h1>
        <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-muted">
          You&apos;re officially a King. Here&apos;s how Kingsway works from here.
        </p>
      </header>

      <div className="welcome-way">
        <Item order={0} title="KingsHour is the heart of it">
          Once a month, on the last Sunday, we gather online. Your next one is{" "}
          <strong className="font-semibold text-fg">{nextDate}</strong>.
          <div className="mt-4">
            <button type="button" onClick={addToCalendar} className="primary-pill">
              Add to calendar
            </button>
          </div>
        </Item>

        <Item order={1} title="Email is your home base">
          Everything important lives in your inbox — the topic, the join link, and a follow-up after
          each session. We send few emails, and each one has a point.
        </Item>

        <Item order={2} title="WhatsApp Status, not a group">
          No noisy group chat. Instead, connect with the founder and watch their WhatsApp Status for
          lightweight reminders and building updates.
          <div className="mt-4">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2 text-sm font-medium transition duration-200 hover:-translate-y-px hover:border-brass/50 hover:bg-brass-soft/30"
            >
              Connect on WhatsApp
            </a>
          </div>
          <span className="mt-2 block font-mono text-xs text-muted">{whatsappDisplay()}</span>
        </Item>

        <Item order={3} title="What to expect next">
          A welcome email is on its way. Before your first KingsHour, we&apos;ll send the topic and the
          link. Between gatherings, keep building — that&apos;s the whole point.
        </Item>
      </div>
    </div>
  );
}

function Item({
  order,
  title,
  children,
}: {
  order: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="welcome-way__item"
      style={{ "--welcome-order": order } as CSSProperties}
    >
      <span className="welcome-way__node" aria-hidden="true" />
      <h2 className="font-sans text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}
