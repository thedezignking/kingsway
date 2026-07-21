"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  updateAdminPassword,
  type PasswordUpdateState,
} from "@/app/admin/actions";

const initialState: PasswordUpdateState = { error: null };

export function PasswordUpdateForm({ destination }: { destination: string }) {
  const [state, action] = useFormState(updateAdminPassword, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={destination} />
      <label className="block">
        <span className="mb-2 block text-xs font-semibold">New password</span>
        <input
          type="password"
          name="password"
          autoComplete="new-password"
          minLength={14}
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
          name="confirmation"
          autoComplete="new-password"
          minLength={14}
          required
          className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-sm outline-none transition-colors focus:border-brass focus:ring-2 focus:ring-brass/15"
        />
      </label>
      <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">
        {state.error}
      </p>
      <SavePasswordButton />
    </form>
  );
}

function SavePasswordButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Saving password…" : "Save password and continue"}
    </button>
  );
}
