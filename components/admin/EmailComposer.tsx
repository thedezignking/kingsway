"use client";

// Admin / EmailComposer (PRD §5.5). Compose -> preview audience -> send/queue under the free
// email budget. No fake open-rate metrics while tracking is off.
import { FormEvent, useState } from "react";
import type { EmailBudget, SendSummary } from "@/lib/modules/communication";

export function EmailComposer() {
  const [preview, setPreview] = useState<{ recipientCount: number; budget: EmailBudget } | null>(null);
  const [summary, setSummary] = useState<SendSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPreview() {
    setLoading(true);
    setMessage(null);
    setSummary(null);
    try {
      const response = await fetch("/api/admin/email");
      const result = (await response.json()) as typeof preview & { error?: string };
      if (!response.ok || !result) throw new Error(result?.error || "Preview failed");
      setPreview(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Preview failed");
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preview) {
      setMessage("Preview the audience before sending.");
      return;
    }
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: String(form.get("subject") || ""),
          body: String(form.get("body") || ""),
          confirmCount: preview.recipientCount,
        }),
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
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">Lean email</p>
        <h2 className="mt-0.5 text-sm font-semibold">Send a purposeful update</h2>
        <p className="mt-1 max-w-xl text-xs text-muted">
          Current build sends to all Kings and queues overflow after the free daily allowance.
          Segmented sends come after the KingsHour lifecycle is stable.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-4 p-4">
        <label className="block">
          <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Subject
          </span>
          <input name="subject" required className="admin-control" placeholder="A Kingsway update" />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
            Body
          </span>
          <textarea
            name="body"
            required
            rows={8}
            className="admin-control resize-y"
            placeholder="<p>Write one clear update...</p>"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <button type="button" onClick={loadPreview} disabled={loading} className="admin-button-secondary">
            {loading ? "Checking..." : "Preview audience"}
          </button>
          <button type="submit" disabled={loading || !preview} className="admin-button-primary disabled:opacity-50">
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
      </form>
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
