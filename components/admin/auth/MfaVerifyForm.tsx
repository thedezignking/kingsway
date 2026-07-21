"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CodeField } from "./MfaEnrollForm";

export function MfaVerifyForm({ destination }: { destination: string }) {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function loadFactor() {
      const { data } = await createClient().auth.mfa.listFactors();
      const factor = data?.totp.find((item) => item.status === "verified");
      if (!factor) {
        router.replace(`/admin/mfa/enroll?next=${encodeURIComponent(destination)}`);
        return;
      }
      setFactorId(factor.id);
    }
    void loadFactor();
  }, [destination, router]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factorId || code.length !== 6) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await createClient().auth.mfa.challengeAndVerify({
      factorId,
      code,
    });
    if (verifyError) {
      setBusy(false);
      setError("That code was not accepted. Wait for a new code and try again.");
      return;
    }
    router.replace(destination);
    router.refresh();
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      <CodeField code={code} setCode={setCode} />
      <p className="min-h-5 text-sm text-red-700" role="status" aria-live="polite">{error}</p>
      <button
        type="submit"
        disabled={busy || !factorId || code.length !== 6}
        className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Verifying…" : "Verify code"}
      </button>
    </form>
  );
}
