"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Enrollment = { id: string; qr: string; secret: string };

export function MfaEnrollForm({ destination }: { destination: string }) {
  const router = useRouter();
  const started = useRef(false);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function begin() {
      const supabase = createClient();
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const verified = factors?.totp.find((factor) => factor.status === "verified");
      if (verified) {
        router.replace(`/admin/mfa/verify?next=${encodeURIComponent(destination)}`);
        return;
      }

      for (const factor of factors?.all ?? []) {
        if (factor.status !== "verified") await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Kingsway Admin",
      });
      if (enrollError) {
        setError("We could not create the authenticator setup. Refresh and try again.");
        return;
      }
      setEnrollment({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
    }

    void begin();
  }, [destination, router]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enrollment || code.length !== 6) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await createClient().auth.mfa.challengeAndVerify({
      factorId: enrollment.id,
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

  if (!enrollment && !error) {
    return <p className="text-sm text-muted" role="status">Preparing secure setup…</p>;
  }

  return (
    <form onSubmit={verify} className="space-y-5">
      {enrollment && (
        <>
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
          <button
            type="submit"
            disabled={busy || code.length !== 6}
            className="w-full rounded-full bg-fg px-5 py-3 text-sm font-semibold text-bone transition-colors hover:bg-fg/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Verify and finish setup"}
          </button>
        </>
      )}
      <p className="text-sm text-red-700" role="status" aria-live="polite">{error}</p>
    </form>
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
