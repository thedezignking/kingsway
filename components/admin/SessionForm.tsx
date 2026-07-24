"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type {
  KingsHourSession,
  PublicImageAspect,
  PublicSessionStatus,
  SessionStatus,
  Topic,
  TopicPillar,
} from "@/lib/supabase/types";

const PILLARS: Array<{ value: TopicPillar; label: string }> = [
  { value: "foundation", label: "Foundation" },
  { value: "career_skills", label: "Career & skills" },
  { value: "money", label: "Money" },
  { value: "business", label: "Business" },
  { value: "faith_character", label: "Faith & character" },
  { value: "relationships", label: "Relationships" },
  { value: "mindset", label: "Mindset" },
];

export function SessionForm({
  topics,
  session,
}: {
  topics: Topic[];
  session?: KingsHourSession;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setMessage(null);
    const form = new FormData(formElement);
    const payload = {
      topicId: String(form.get("topicId") || "") || null,
      date: String(form.get("date") || ""),
      description: String(form.get("description") || ""),
      facilitator: String(form.get("facilitator") || ""),
      meetLink: String(form.get("meetLink") || ""),
      resources: String(form.get("resources") || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      status: String(form.get("status") || "upcoming") as SessionStatus,
      slug: String(form.get("slug") || ""),
      publicStatus: String(form.get("publicStatus") || "draft") as PublicSessionStatus,
      publicTitle: String(form.get("publicTitle") || ""),
      publicSummary: String(form.get("publicSummary") || ""),
      publicBody: String(form.get("publicBody") || ""),
      publicImageUrl: String(form.get("publicImageUrl") || ""),
      publicImageAlt: String(form.get("publicImageAlt") || ""),
      publicImageAspect: String(form.get("publicImageAspect") || "1:1") as PublicImageAspect,
    };

    try {
      const response = await fetch(
        session ? `/api/admin/sessions/${session.id}` : "/api/admin/sessions",
        {
          method: session ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as {
        session?: KingsHourSession;
        error?: string;
      };
      if (!response.ok || !result.session) throw new Error(result.error || "Session was not saved");
      setMessage(session ? "Session updated." : "Session created.");
      if (!session) router.push(`/admin/kingshour/${result.session.id}`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Session was not saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="border border-line bg-white/75">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          {session ? "Session record" : "New session"}
        </p>
        <h2 className="mt-0.5 text-sm font-semibold">
          {session ? "Edit KingsHour" : "Plan a KingsHour"}
        </h2>
      </header>

      <form onSubmit={submit} className="space-y-4 p-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <Control label="Topic">
            <select name="topicId" defaultValue={session?.topic_id ?? ""} className="admin-control">
              <option value="">No topic selected</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title} · {pillarLabel(topic.pillar)}
                </option>
              ))}
            </select>
          </Control>
          <Control label="Date and time">
            <input
              type="datetime-local"
              name="date"
              required
              defaultValue={session ? toLocalInput(session.date) : ""}
              className="admin-control"
            />
          </Control>
          <Control label="Facilitator">
            <input
              name="facilitator"
              defaultValue={session?.facilitator ?? ""}
              placeholder="Name"
              className="admin-control"
            />
          </Control>
          <Control label="Status">
            <select name="status" defaultValue={session?.status ?? "upcoming"} className="admin-control">
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="done">Done</option>
            </select>
          </Control>
        </div>

        <Control label="Google Meet link" hint="Required before invitations can be scheduled.">
          <input
            type="url"
            name="meetLink"
            defaultValue={session?.meet_link ?? ""}
            placeholder="https://meet.google.com/..."
            className="admin-control"
          />
        </Control>

        <Control label="Description">
          <textarea
            name="description"
            rows={4}
            defaultValue={session?.description ?? ""}
            placeholder="What this session will hold"
            className="admin-control resize-y"
          />
        </Control>

        <Control label="Resources" hint="One URL or resource per line.">
          <textarea
            name="resources"
            rows={3}
            defaultValue={session?.resources?.join("\n") ?? ""}
            placeholder="https://..."
            className="admin-control resize-y font-mono text-xs"
          />
        </Control>

        <section className="border-t border-line pt-4">
          <div className="mb-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
              Public lead magnet
            </p>
            <p className="mt-1 text-xs text-muted">
              These fields power the shareable KingsHour page for flyers, WhatsApp Status and DMs.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Control label="Slug" hint="Public URL: /kingshour/your-slug">
              <input
                name="slug"
                defaultValue={session?.slug ?? ""}
                placeholder="building-without-burning-out"
                className="admin-control font-mono text-xs"
              />
            </Control>
            <Control label="Public status">
              <select
                name="publicStatus"
                defaultValue={session?.public_status ?? "draft"}
                className="admin-control"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Control>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Control label="Public title">
              <input
                name="publicTitle"
                defaultValue={session?.public_title ?? ""}
                placeholder="Use topic title if empty"
                className="admin-control"
              />
            </Control>
            <Control label="Public summary">
              <input
                name="publicSummary"
                defaultValue={session?.public_summary ?? ""}
                placeholder="One short line for the page"
                className="admin-control"
              />
            </Control>
          </div>
          <div className="mt-4">
            <Control label="Public body" hint="Short event-specific copy. Keep it calm and direct.">
              <textarea
                name="publicBody"
                rows={4}
                defaultValue={session?.public_body ?? ""}
                className="admin-control resize-y"
              />
            </Control>
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(160px,0.35fr)]">
            <Control label="Image URL">
              <input
                name="publicImageUrl"
                type="url"
                defaultValue={session?.public_image_url ?? ""}
                placeholder="https://..."
                className="admin-control"
              />
            </Control>
            <Control label="Image aspect">
              <select
                name="publicImageAspect"
                defaultValue={session?.public_image_aspect ?? "1:1"}
                className="admin-control"
              >
                <option value="1:1">1:1 square</option>
                <option value="4:5">4:5 IG portrait</option>
              </select>
            </Control>
          </div>
          <div className="mt-4">
            <Control label="Image alt text">
              <input
                name="publicImageAlt"
                defaultValue={session?.public_image_alt ?? ""}
                placeholder="Describe the image"
                className="admin-control"
              />
            </Control>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button type="submit" disabled={saving} className="admin-button-primary disabled:opacity-50">
            {saving ? "Saving…" : session ? "Save changes" : "Create session"}
          </button>
          <p className="text-xs text-muted" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      </form>

      {!session && <InlineTopicForm />}
    </section>
  );
}

function InlineTopicForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSaving(true);
    setMessage(null);
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(form.get("title") || ""),
          pillar: String(form.get("pillar") || "foundation"),
          purpose: String(form.get("purpose") || ""),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Topic was not added");
      formElement.reset();
      setMessage("Topic added. It is now available above.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Topic was not added");
    } finally {
      setSaving(false);
    }
  }

  return (
    <details className="border-t border-line bg-[#fbfaf7]/70">
      <summary className="cursor-pointer list-none px-4 py-3 text-xs font-semibold hover:bg-[#f7f5ef]">
        Add a topic to the bank
      </summary>
      <form onSubmit={submit} className="grid gap-3 border-t border-line p-4 lg:grid-cols-2">
        <Control label="Topic title">
          <input name="title" required minLength={3} maxLength={140} className="admin-control" />
        </Control>
        <Control label="Pillar">
          <select name="pillar" className="admin-control">
            {PILLARS.map((pillar) => (
              <option key={pillar.value} value={pillar.value}>
                {pillar.label}
              </option>
            ))}
          </select>
        </Control>
        <div className="lg:col-span-2">
          <Control label="Purpose" hint="Optional. Why this conversation matters.">
            <textarea name="purpose" rows={2} className="admin-control resize-y" />
          </Control>
        </div>
        <div className="flex items-center gap-3 lg:col-span-2">
          <button type="submit" disabled={saving} className="admin-button-secondary disabled:opacity-50">
            {saving ? "Adding…" : "Add topic"}
          </button>
          <p className="text-xs text-muted" role="status" aria-live="polite">
            {message}
          </p>
        </div>
      </form>
    </details>
  );
}

function Control({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function pillarLabel(value: TopicPillar): string {
  return PILLARS.find((pillar) => pillar.value === value)?.label ?? value;
}

function toLocalInput(value: string): string {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
