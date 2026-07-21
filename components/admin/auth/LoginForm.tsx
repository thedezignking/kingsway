"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestAdminLink, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { error: null, sent: false };

export function LoginForm({ destination }: { destination: string }) {
  const [state, action] = useFormState(requestAdminLink, initialState);

  if (state.sent) {
    return (
      <div role="status" className="border-l-2 border-brass bg-[#fbfaf7] p-4">
        <p className="text-sm font-semibold">Check your email</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          If that address is approved, its secure sign-in link is on the way. The link expires and
          can only be used once.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={destination} />
      <label className="block">
        <span className="mb-2 block text-xs font-semibold">Admin email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          spellCheck={false}
          required
          autoFocus
          className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 hover:border-muted/50 focus:border-brass focus:ring-2 focus:ring-brass/15"
          placeholder="you@company.com"
        />
      </label>
      <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">
        {state.error}
      </p>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Sending secure link…" : "Email me a secure link"}
    </button>
  );
}
