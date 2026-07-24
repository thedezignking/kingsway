"use client";

import { useState } from "react";
import type { LifecycleEmailType, SendSummary } from "@/lib/modules/communication";

const ACTIONS: Array<{ type: LifecycleEmailType; label: string; help: string }> = [
  {
    type: "invitation",
    label: "Invitation",
    help: "Targets all Kings, respecting the daily email budget.",
  },
  {
    type: "reminder",
    label: "Reminder",
    help: "Targets registered Kings only.",
  },
  {
    type: "follow_up",
    label: "Follow-up",
    help: "Targets Kings marked attended.",
  },
];

export function SessionEmailActions({ sessionId }: { sessionId: string }) {
  const [selected, setSelected] = useState<LifecycleEmailType>("invitation");
  const [preview, setPreview] = useState<{ recipientCount: number; budget: SendSummary["budget"] } | null>(
    null,
  );
  const [summary, setSummary] = useState<SendSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const action = ACTIONS.find((item) => item.type === selected) ?? ACTIONS[0];

  async function loadPreview(type = selected) {
    setLoading(true);
    setMessage(null);
    setSummary(null);
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/email?type=${type}`);
      const result = (await response.json()) as typeof preview & { error?: string };
      if (!response.ok || !result) throw new Error(result?.error || "Preview failed");
      setPreview(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Preview failed");
    } finally {
      setLoading(false);
    }
  }

  async function send() {
    if (!preview) return;
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selected, confirmCount: preview.recipientCount }),
      });
      const result = (await response.json()) as SendSummary & { error?: string };
      if (!response.ok) throw new Error(result.error || "Send failed");
      setSummary(result);
      setPreview({ recipientCount: result.recipientCount, budget: result.budget });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Send failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-line bg-white/75">
      <header className="border-b border-line px-4 py-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
          Lifecycle email
        </p>
        <h2 className="mt-0.5 text-sm font-semibold">Invite, remind, follow up</h2>
      </header>

      <div className="space-y-4 p-4">
        <div className="grid gap-2 sm:grid-cols-3">
          {ACTIONS.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                setSelected(item.type);
                setPreview(null);
                setSummary(null);
              }}
              className={`border px-3 py-3 text-left text-xs transition ${
                selected === item.type
                  ? "border-fg bg-fg text-bone"
                  : "border-line bg-white hover:bg-[#fbfaf7]"
              }`}
            >
              <span className="block font-semibold">{item.label}</span>
              <span className={selected === item.type ? "text-bone/70" : "text-muted"}>
                {item.help}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button type="button" onClick={() => loadPreview()} disabled={loading} className="admin-button-secondary">
            {loading ? "Checking..." : `Preview ${action.label.toLowerCase()}`}
          </button>
          <button
            type="button"
            onClick={send}
            disabled={loading || !preview}
            className="admin-button-primary disabled:opacity-50"
          >
            Send to {preview?.recipientCount ?? 0}
          </button>
          <p className="text-xs text-muted" role="status" aria-live="polite">
            {message}
          </p>
        </div>

        {preview && (
          <div className="grid gap-2 border border-line bg-[#fbfaf7] p-3 text-xs sm:grid-cols-4">
            <Metric label="Recipients" value={preview.recipientCount} />
            <Metric label="Bulk remaining" value={preview.budget.bulkRemaining} />
            <Metric label="Used today" value={preview.budget.usedToday} />
            <Metric label="Queued" value={preview.budget.queued} />
          </div>
        )}

        {summary && (
          <div className="border border-[#cdd9cc] bg-[#f4faf3] p-3 text-xs text-[#315f39]">
            Sent {summary.sentCount}. Queued {summary.queuedCount}. Failed {summary.failedCount}.
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <p>
      <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
      <strong className="mt-1 block text-base font-semibold text-fg">{value}</strong>
    </p>
  );
}
