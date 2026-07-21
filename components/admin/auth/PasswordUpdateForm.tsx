"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 14;

export function PasswordUpdateForm({ destination }: { destination: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function updatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setBusy(true);
    setError(null);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    if (updateError) {
      setBusy(false);
      setError("We could not save that password. Try a different one.");
      return;
    }

    router.replace(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`);
    router.refresh();
  }

  return (
    <form onSubmit={updatePassword} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold">New password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          required
          autoFocus
          className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-sm outline-none transition-colors focus:border-brass focus:ring-2 focus:ring-brass/15"
        />
        <span className="mt-2 block text-xs text-muted">At least 14 characters. A passphrase works well.</span>
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold">Confirm password</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          minLength={MIN_PASSWORD_LENGTH}
          required
          className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-sm outline-none transition-colors focus:border-brass focus:ring-2 focus:ring-brass/15"
        />
      </label>
      <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">{error}</p>
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-wait disabled:opacity-60"
      >
        {busy ? "Saving password…" : "Save password and continue"}
      </button>
    </form>
  );
}
