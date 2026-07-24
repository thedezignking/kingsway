// Admin / MemberProfile (PRD §5.2). One operational record: identity, Census, KingsHour and email.
import { CENSUS_CHAPTERS, getQuestion } from "@/lib/census/questions";
import type { MemberProfile as Profile } from "@/lib/modules/members";

export function MemberProfile({ profile }: { profile: Profile }) {
  const { member, responses, progress, registrations, communications } = profile;
  const signals = [
    ["Season", answer(profile, "season")],
    ["Occupation", answer(profile, "occupation")],
    ["Goal", answer(profile, "biggest_goal")],
    ["Biggest obstacles", answer(profile, "obstacles")],
    ["Requested topics", answer(profile, "topics")],
  ] as const;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
      <div className="min-w-0 space-y-4">
        <section className="border border-line bg-white/75">
          <header className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold">Builder profile</h2>
          </header>
          <dl className="divide-y divide-line/70 px-4">
            {signals.map(([label, value]) => (
              <div key={label} className="grid gap-1 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-5">
                <dt className="font-mono text-[10px] uppercase tracking-wide text-muted">{label}</dt>
                <dd className="text-sm leading-relaxed">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border border-line bg-white/75">
          <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">King&apos;s Census</h2>
              <p className="mt-0.5 text-xs text-muted">
                {member.status === "king"
                  ? `${responses.length} saved answers`
                  : progress?.current_screen
                    ? `Stopped near ${getQuestion(progress.current_screen)?.asksFor ?? progress.current_screen}`
                    : "Incomplete record"}
              </p>
            </div>
            <Status status={member.status} />
          </header>

          {responses.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted">No Census responses yet.</p>
          ) : (
            <div className="divide-y divide-line/70">
              {CENSUS_CHAPTERS.filter((chapter) => chapter.index < 6).map((chapter) => {
                const chapterResponses = responses.filter(
                  (response) => getQuestion(response.question_id)?.chapter === chapter.index,
                );
                if (!chapterResponses.length) return null;
                return (
                  <details key={chapter.index} className="group" open={chapter.index === 1}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium hover:bg-[#fbfaf7]">
                      <span>{chapter.name}</span>
                      <span className="font-mono text-[10px] text-muted group-open:text-brass">
                        {chapterResponses.length} answers
                      </span>
                    </summary>
                    <dl className="border-t border-line/70 bg-[#fbfaf7]/60 px-4 pb-2">
                      {chapterResponses.map((response) => (
                        <div
                          key={`${response.question_id}-${response.question_version}`}
                          className="grid gap-1 border-t border-line/60 py-3 first:border-t-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5"
                        >
                          <dt className="font-mono text-[9px] uppercase tracking-wide text-muted">
                            {getQuestion(response.question_id)?.asksFor ?? response.question_id}
                          </dt>
                          <dd className="text-sm leading-relaxed">
                            {renderResponse(response.question_id, response.response)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                );
              })}
            </div>
          )}
        </section>

        <section className="border border-line bg-white/75">
          <header className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold">KingsHour history</h2>
          </header>
          {registrations.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted">No registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="font-mono text-[9px] uppercase tracking-wide text-muted">
                  <tr className="border-b border-line">
                    <th className="px-4 py-2.5 font-medium">Session</th>
                    <th className="px-4 py-2.5 font-medium">RSVP</th>
                    <th className="px-4 py-2.5 font-medium">Attendance</th>
                    <th className="px-4 py-2.5 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="border-t border-line/70 first:border-t-0">
                      <td className="px-4 py-3 font-medium">
                        {registration.topic?.title ?? "KingsHour"}
                      </td>
                      <td className="px-4 py-3 capitalize text-muted">
                        {registration.registration_status.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 capitalize text-muted">
                        {registration.attendance_status.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-xs text-muted">
                        {registration.session ? shortDate(registration.session.date) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-4">
        <section className="border border-line bg-white/75">
          <header className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold">Record</h2>
          </header>
          <dl className="space-y-3 px-4 py-4 text-sm">
            <Field label="Email" value={member.email} />
            <Field label="WhatsApp" value={member.phone} />
            <Field label="Current residence" value={[member.state_city, member.country].filter(Boolean).join(", ")} />
            <Field label="Age" value={member.age_range} />
            <Field label="Joined" value={longDate(member.join_date)} />
            <Field label="Last activity" value={longDate(member.last_activity)} />
          </dl>
          <div className="flex gap-2 border-t border-line px-4 py-3">
            <a href={`mailto:${member.email}`} className="admin-button-secondary flex-1">
              Email
            </a>
            {member.phone && (
              <a
                href={`https://wa.me/${member.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="admin-button-secondary flex-1"
              >
                WhatsApp
              </a>
            )}
          </div>
        </section>

        <section className="border border-line bg-white/75">
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold">Communication</h2>
            <span className="font-mono text-[10px] text-muted">{communications.length}</span>
          </header>
          {communications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted">Nothing sent yet.</p>
          ) : (
            <ol className="divide-y divide-line/70">
              {communications.map((communication) => (
                <li key={communication.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[9px] uppercase tracking-wide text-muted">
                      {communication.type.replace("_", " ")}
                    </span>
                    <span className="font-mono text-[9px] text-muted">
                      {shortDate(communication.sent_at)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed">
                    {communication.subject || "No subject recorded"}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </aside>
    </div>
  );
}

function Status({ status }: { status: "king" | "incomplete" }) {
  return (
    <span
      className={`rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-wide ${
        status === "king" ? "bg-emerald-50 text-emerald-800" : "bg-brass-soft text-fg"
      }`}
    >
      {status === "king" ? "Complete" : "Incomplete"}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="font-mono text-[9px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 break-words">{value || "—"}</dd>
    </div>
  );
}

function answer(profile: Profile, questionId: string): string {
  const response = profile.responses.find((item) => item.question_id === questionId);
  return response ? renderResponse(questionId, response.response) : "";
}

/** Turn a stored response into readable copy, mapping canonical option values to labels. */
function renderResponse(questionId: string, response: unknown): string {
  const question = getQuestion(questionId);
  const toLabel = (value: string) =>
    question?.options?.find((option) => option.value === value)?.label ?? value;
  if (Array.isArray(response)) return response.map((value) => toLabel(String(value))).join(", ");
  if (response && typeof response === "object") {
    const value = response as {
      month?: number;
      day?: number;
      country?: string;
      state_city?: string;
      values?: string[];
      other?: string;
    };
    if (value.country) return [value.state_city, value.country].filter(Boolean).join(", ");
    if (value.month && value.day) return `${value.day}/${value.month}`;
    if (value.values) {
      return [...value.values.map(toLabel), value.other].filter(Boolean).join(", ");
    }
    return JSON.stringify(response);
  }
  if (typeof response === "string") return toLabel(response);
  return String(response);
}

function shortDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
}

function longDate(value: string): string {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
