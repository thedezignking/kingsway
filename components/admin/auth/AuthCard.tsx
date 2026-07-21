import Link from "next/link";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f7f5ef] px-5 py-12">
      <div className="w-full max-w-[430px]">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted transition-colors hover:text-fg"
        >
          <span className="h-2 w-2 rounded-sm bg-brass" />
          Kingsway
        </Link>
        <section className="border border-line bg-white p-6 shadow-[0_18px_50px_rgba(23,21,46,0.06)] sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">{eyebrow}</p>
          <h1 className="mt-3 text-balance text-2xl font-semibold tracking-[-0.02em]">{title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          <div className="mt-7">{children}</div>
        </section>
        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70">
          Restricted system · Authorized access only
        </p>
      </div>
    </main>
  );
}
