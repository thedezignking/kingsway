"use client";

import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { verifyAdminMfa, type MfaVerifyState } from "@/app/admin/actions";

type Enrollment = { id: string; qr: string; secret: string };
const initialState: MfaVerifyState = { error: null };

export function MfaEnrollForm({
  destination,
  enrollment,
}: {
  destination: string;
  enrollment: Enrollment;
}) {
  const [state, action] = useFormState(verifyAdminMfa, initialState);
  const [code, setCode] = useState("");

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="factorId" value={enrollment.id} />
      <input type="hidden" name="next" value={destination} />
      <div className="grid place-items-center border border-line bg-[#fbfaf7] p-5">
        <Image
          src={enrollment.qr}
          alt="QR code for Kingsway Admin two-factor authentication"
          width={190}
          height={190}
          unoptimized
        />
      </div>
      <div className="text-sm leading-relaxed text-muted">
        <p>Scan this with Google Authenticator, 1Password, Authy, or another TOTP app.</p>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs font-semibold text-fg">Enter key manually</summary>
          <code className="mt-2 block break-all rounded bg-[#f1eee6] p-2 font-mono text-xs text-fg">
            {enrollment.secret}
          </code>
        </details>
      </div>
      <CodeField code={code} setCode={setCode} />
      <VerifyButton disabled={code.length !== 6} label="Verify and finish setup" />
      <p className="text-sm text-red-700" role="status" aria-live="polite">{state.error}</p>
    </form>
  );
}

export function VerifyButton({ disabled, label }: { disabled: boolean; label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Verifying…" : label}
    </button>
  );
}

export function CodeField({
  code,
  setCode,
}: {
  code: string;
  setCode: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold">6-digit code</span>
      <input
        type="text"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]{6}"
        maxLength={6}
        value={code}
        onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
        className="w-full rounded-md border border-line bg-[#fbfaf7] px-3.5 py-3 text-center font-mono text-xl tracking-[0.35em] outline-none transition-colors focus:border-brass focus:ring-2 focus:ring-brass/15"
        aria-describedby="code-help"
        required
      />
      <span id="code-help" className="mt-2 block text-xs text-muted">
        Codes refresh every 30 seconds.
      </span>
    </label>
  );
}
