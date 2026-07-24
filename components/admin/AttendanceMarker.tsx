"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionRegistration } from "@/lib/modules/kingshour";
import type { AttendanceStatus } from "@/lib/supabase/types";

export function AttendanceMarker({
  sessionId,
  registrations,
}: {
  sessionId: string;
  registrations: SessionRegistration[];
}) {
  const router = useRouter();
  const [savingMember, setSavingMember] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function update(memberId: string, status: AttendanceStatus) {
    setSavingMember(memberId);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/sessions/${sessionId}/attendance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Attendance was not saved");
      setMessage("Attendance updated.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Attendance was not saved");
    } finally {
      setSavingMember(null);
    }
  }

  return (
    <section className="border border-line bg-white/75">
      <header className="flex items-end justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">Attendance</p>
          <h2 className="mt-0.5 text-sm font-semibold">Registered Kings</h2>
        </div>
        <p className="text-xs text-muted" role="status" aria-live="polite">
          {message ?? `${registrations.length} registered`}
        </p>
      </header>

      {registrations.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-muted">No registrations yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="border-b border-line bg-[#faf9f6] font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">King</th>
                <th className="px-4 py-3 font-medium">Residence</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">RSVP</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {registrations.map((registration) => (
                <tr key={registration.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-fg">
                      {registration.member?.first_name ?? "Unknown King"}
                    </p>
                    <p className="mt-0.5 text-muted">
                      {registration.member?.email ?? registration.member_id}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {registration.member?.country ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {registration.source?.replace(/_/g, " ") ?? "—"}
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">
                    {registration.registration_status}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={registration.attendance_status}
                      disabled={savingMember === registration.member_id}
                      onChange={(event) =>
                        update(registration.member_id, event.target.value as AttendanceStatus)
                      }
                      className="admin-control min-w-[130px]"
                      aria-label={`Attendance for ${registration.member?.first_name ?? "King"}`}
                    >
                      <option value="unknown">Not marked</option>
                      <option value="attended">Attended</option>
                      <option value="no_show">No show</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {registration.follow_up_completed ? "Done" : "Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
