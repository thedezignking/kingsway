"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { savePendingKingsHour } from "@/lib/census/storage";
import { AddToCalendar } from "@/components/shared/AddToCalendar";
import { AnalyticsEvent, track } from "@/lib/analytics/events";

type State =
  | { kind: "idle" }
  | { kind: "registered"; firstName: string }
  | { kind: "needs_census"; email: string; existingIncomplete: boolean };

export function RsvpRegistration({
  sessionId,
  title,
  date,
}: {
  sessionId: string;
  title: string;
  date: string;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const start = useMemo(() => new Date(date), [date]);
  const end = useMemo(() => new Date(start.getTime() + 60 * 60 * 1000), [start]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    track(AnalyticsEvent.KINGSHOUR_REGISTRATION_STARTED, { sessionId, source: "rsvp" });
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/rsvp/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "rsvp_email" }),
      });
      const result = (await response.json()) as {
        status?: "registered" | "needs_census";
        firstName?: string;
        existingIncomplete?: boolean;
        error?: string;
      };
      if (!response.ok || !result.status) throw new Error(result.error || "RSVP failed");
      if (result.status === "registered") {
        track(AnalyticsEvent.KINGSHOUR_REGISTRATION_CONFIRMED, { sessionId, source: "rsvp" });
        setState({ kind: "registered", firstName: result.firstName || "King" });
      } else {
        savePendingKingsHour({ sessionId, email, source: "rsvp_email" });
        track(AnalyticsEvent.KINGSHOUR_CENSUS_BRIDGE, {
          sessionId,
          source: "rsvp",
          existingIncomplete: result.existingIncomplete === true,
        });
        setState({
          kind: "needs_census",
          email,
          existingIncomplete: result.existingIncomplete === true,
        });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "RSVP failed");
    } finally {
      setSaving(false);
    }
  }

  if (state.kind === "registered") {
    return (
      <div className="space-y-4 rounded-[1.25rem] border border-line bg-white/80 p-5">
        <p className="text-sm leading-relaxed text-muted">
          You are registered, {state.firstName}. Add it to your calendar and watch your email for
          the final join details.
        </p>
        <AddToCalendar
          event={{
            uid: `kingshour-${sessionId}@kingsway`,
            title,
            description: "KingsHour. Final join details will come by email.",
            start,
            end,
            url: typeof window === "undefined" ? undefined : window.location.href,
          }}
        />
      </div>
    );
  }

  if (state.kind === "needs_census") {
    return (
      <div className="space-y-4 rounded-[1.25rem] border border-line bg-white/80 p-5">
        <p className="text-sm leading-relaxed text-muted">
          {state.existingIncomplete
            ? "You have already started the King's Census. Continue it and we will register you when you finish."
            : "Before this KingsHour, we start with the King's Census. It helps us know who is in the room before we gather."}
        </p>
        <Link href={`/census?session=${sessionId}&from=rsvp`} className="primary-pill w-full">
          Continue to the King&apos;s Census
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {state.email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-[1.25rem] border border-line bg-white/80 p-5">
      <label className="block">
        <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
          Email address
        </span>
        <input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="admin-control rounded-full bg-white px-4"
        />
      </label>
      <button type="submit" disabled={saving} className="primary-pill w-full disabled:opacity-50">
        {saving ? "Checking..." : "Confirm RSVP"}
      </button>
      <p className="min-h-4 text-xs text-muted" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
