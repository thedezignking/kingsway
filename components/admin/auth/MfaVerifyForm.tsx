"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { verifyAdminMfa, type MfaVerifyState } from "@/app/admin/actions";
import { CodeField, VerifyButton } from "./MfaEnrollForm";

const initialState: MfaVerifyState = { error: null };

export function MfaVerifyForm({
  destination,
  factorId,
}: {
  destination: string;
  factorId: string;
}) {
  const [state, action] = useFormState(verifyAdminMfa, initialState);
  const [code, setCode] = useState("");

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="factorId" value={factorId} />
      <input type="hidden" name="next" value={destination} />
      <CodeField code={code} setCode={setCode} />
      <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">{state.error}</p>
      <VerifyButton disabled={code.length !== 6} label="Verify code" />
    </form>
  );
}
