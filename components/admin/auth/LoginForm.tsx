"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  requestPasswordReset,
  signIn,
  type LoginState,
  type PasswordResetState,
} from "@/app/admin/actions";

const initialLogin: LoginState = { error: null };
const initialReset: PasswordResetState = { error: null, sent: false };

export function LoginForm({ destination }: { destination: string }) {
  const [loginState, loginAction] = useFormState(signIn, initialLogin);
  const [resetState, resetAction] = useFormState(requestPasswordReset, initialReset);

  return (
    <div className="space-y-5">
      <form action={loginAction} className="space-y-5">
        <input type="hidden" name="next" value={destination} />
        <EmailField />
        <label className="block">
          <span className="mb-2 block text-xs font-semibold">Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-sm outline-none transition-colors hover:border-muted/50 focus:border-brass focus:ring-2 focus:ring-brass/15"
          />
        </label>
        <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">
          {loginState.error}
        </p>
        <LoginButton />
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
          Password help
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {resetState.sent ? (
        <div role="status" className="border-l-2 border-brass bg-[#fbfaf7] p-4">
          <p className="text-sm font-semibold">Check your email</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            If that address is approved, its password setup link is on the way.
          </p>
        </div>
      ) : (
        <form action={resetAction} className="space-y-3">
          <input type="hidden" name="next" value={destination} />
          <EmailField autoFocus={false} />
          <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">
            {resetState.error}
          </p>
          <ResetButton />
        </form>
      )}
    </div>
  );
}

function EmailField({ autoFocus = true }: { autoFocus?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold">Admin email</span>
      <input
        type="email"
        name="email"
        autoComplete="email"
        spellCheck={false}
        required
        autoFocus={autoFocus}
        className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted/50 hover:border-muted/50 focus:border-brass focus:ring-2 focus:ring-brass/15"
        placeholder="you@company.com"
      />
    </label>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Checking access…" : "Continue"}
    </button>
  );
}

function ResetButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-muted/60 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? "Sending setup email…" : "Set or reset password"}
    </button>
  );
}
