// Welcome Experience: the first moment of belonging, not a confirmation page.
"use client";

import { useEffect, useState } from "react";
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
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <div className="anim-crown flex h-16 w-16 items-center justify-center rounded-full bg-fg text-surface">
          <Crown size={32} />
        </div>
        <h1 className="text-balance font-display text-4xl leading-tight">
          {name ? `Welcome home, ${name}.` : "Welcome home."}
        </h1>
        <p className="text-pretty text-lg text-muted">
          You&apos;re officially a King. Here&apos;s how Kingsway works from here.
        </p>
      </header>

      <div className="welcome-way">
        <Item title="KingsHour is the heart of it">
          Once a month, on the last Sunday, we gather online. Your next one is{" "}
          <strong className="font-semibold text-fg">{nextDate}</strong>.
          <div className="mt-4">
            <button type="button" onClick={addToCalendar} className="primary-pill">
              Add to calendar
            </button>
          </div>
        </Item>

        <Item title="Email is your home base">
          Everything important lives in your inbox — the topic, the join link, and a follow-up after
          each session. We send few emails, and each one has a point.
        </Item>

        <Item title="WhatsApp Status, not a group">
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

        <Item title="What to expect next">
          A welcome email is on its way. Before your first KingsHour, we&apos;ll send the topic and the
          link. Between gatherings, keep building — that&apos;s the whole point.
        </Item>
      </div>
    </div>
  );
}

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="welcome-way__item">
      <span className="welcome-way__node" aria-hidden="true" />
      <h2 className="font-sans text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}
