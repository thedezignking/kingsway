// Admin / MemberProfile (PRD §5.2). One source of truth per King: personal info · builder profile
// (census responses) · communication timeline. Presentational; data fetched by the page.
import type { MemberProfile as Profile } from "@/lib/modules/members";
import { getQuestion } from "@/lib/census/questions";

export function MemberProfile({ profile }: { profile: Profile }) {
  const { member, responses, communications } = profile;
  return (
    <div className="flex flex-col gap-6">
      <div className="border border-line bg-white/70 p-5">
        <h2 className="text-lg font-semibold">{member.first_name}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
          <Field label="Email" value={member.email} />
          <Field label="Phone" value={member.phone} />
          <Field label="Country" value={member.country} />
          <Field label="State/City" value={member.state_city} />
          <Field label="Age" value={member.age_range} />
          <Field label="Status" value={member.status} />
          <Field label="Joined" value={new Date(member.join_date).toLocaleDateString()} />
        </dl>
      </div>

      <div className="border border-line bg-white/70 p-5">
        <h3 className="text-sm font-semibold">Builder profile (census)</h3>
        {responses.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No census responses yet.</p>
        ) : (
          <dl className="mt-3 flex flex-col gap-2 text-sm">
            {responses.map((r) => (
              <div key={r.question_id} className="flex flex-col border-t border-line pt-2">
                <dt className="font-mono text-[10px] uppercase tracking-wide text-muted">
                  {getQuestion(r.question_id)?.asksFor ?? r.question_id}
                </dt>
                <dd>{renderResponse(r.question_id, r.response)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="border border-line bg-white/70 p-5">
        <h3 className="text-sm font-semibold">Communication timeline</h3>
        {communications.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nothing sent yet.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {communications.map((c) => (
              <li key={c.id} className="flex justify-between border-t border-line py-2">
                <span>
                  {c.type}
                  {c.subject ? ` — ${c.subject}` : ""}
                </span>
                <span className="font-mono text-[10px] text-muted">
                  {new Date(c.sent_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

/** Turn a stored response into a readable string, mapping option values to labels. */
function renderResponse(questionId: string, response: unknown): string {
  const q = getQuestion(questionId);
  const toLabel = (v: string) => q?.options?.find((o) => o.value === v)?.label ?? v;
  if (Array.isArray(response)) return response.map((v) => toLabel(String(v))).join(", ");
  if (response && typeof response === "object") {
    const o = response as { month?: number; day?: number; country?: string; state_city?: string };
    if (o.country) return [o.country, o.state_city].filter(Boolean).join(", ");
    if (o.month && o.day) return `${o.month}/${o.day}`;
    return JSON.stringify(response);
  }
  if (typeof response === "string") return toLabel(response);
  return String(response);
}
