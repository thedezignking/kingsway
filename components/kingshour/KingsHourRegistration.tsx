"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { savePendingKingsHour } from "@/lib/census/storage";
import { AddToCalendar } from "@/components/shared/AddToCalendar";
import { AnalyticsEvent, track } from "@/lib/analytics/events";

type RegisterState =
  | { kind: "idle" }
  | { kind: "registered"; firstName: string }
  | { kind: "needs_census"; email: string; existingIncomplete: boolean };

export function KingsHourRegistration({
  slug,
  sessionId,
  title,
  date,
}: {
  slug: string;
  sessionId: string;
  title: string;
  date: string;
}) {
  const [state, setState] = useState<RegisterState>({ kind: "idle" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const start = useMemo(() => new Date(date), [date]);
  const end = useMemo(() => new Date(start.getTime() + 60 * 60 * 1000), [start]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    track(AnalyticsEvent.KINGSHOUR_REGISTRATION_STARTED, { slug, sessionId });
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/kingshour/${slug}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "public_kingshour" }),
      });
      const result = (await response.json()) as {
        status?: "registered" | "needs_census";
        firstName?: string;
        existingIncomplete?: boolean;
        error?: string;
      };
      if (!response.ok || !result.status) throw new Error(result.error || "Registration failed");
      if (result.status === "registered") {
        track(AnalyticsEvent.KINGSHOUR_REGISTRATION_CONFIRMED, { slug, sessionId });
        setState({ kind: "registered", firstName: result.firstName || "King" });
      } else {
        savePendingKingsHour({ sessionId, slug, email, source: "public_kingshour" });
        track(AnalyticsEvent.KINGSHOUR_CENSUS_BRIDGE, { slug, sessionId, existingIncomplete: result.existingIncomplete === true });
        setState({
          kind: "needs_census",
          email,
          existingIncomplete: result.existingIncomplete === true,
        });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-[1.25rem] border border-line bg-white/80 p-5 shadow-[0_20px_80px_rgba(23,21,46,0.05)]">
      <p className="eyebrow text-brass">Register</p>
      <h2 className="mt-2 text-balance font-sans text-2xl font-medium leading-tight">
        Join this KingsHour
      </h2>

      {state.kind === "registered" ? (
        <div className="mt-5 space-y-4">
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
      ) : state.kind === "needs_census" ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            {state.existingIncomplete
              ? "You have already started the King's Census. Continue it, and we will register you for this KingsHour when you finish."
              : "Before this KingsHour, we start with the King's Census. It helps us know who is in the room before we ask people to gather."}
          </p>
          <Link href={`/census?session=${sessionId}&from=kingshour`} className="primary-pill w-full">
            Continue to the King&apos;s Census
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            {state.email}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-3">
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
            {saving ? "Checking..." : "Register for KingsHour"}
          </button>
          <p className="min-h-4 text-xs text-muted" role="status" aria-live="polite">
            {message}
          </p>
        </form>
      )}
    </section>
  );
}
