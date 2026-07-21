// Landing / How Kingsway Works — the journey (PRD §4.1). This IS a real sequence, so numbered
// markers earn their place. Mono numerals carry the order; the last step is the destination.
const STEPS = [
  { n: "01", title: "Become a King", body: "One step to join. Free, always." },
  { n: "02", title: "King's Census", body: "A short conversation, not a form — so we understand what you're building." },
  { n: "03", title: "Welcome", body: "You're in. We show you the rhythm and what's next." },
  { n: "04", title: "KingsHour", body: "The last Sunday of every month. Where the community comes alive.", last: true },
];

export function HowItWorks() {
  return (
    <section className="py-16">
      <div className="hairline mb-12" />
      <p className="eyebrow">How it works</p>
      <h2 className="mt-6 font-display text-3xl">A rhythm, not a funnel</h2>
      <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className={`flex flex-col gap-2 p-6 ${s.last ? "bg-ink text-bone" : "bg-surface"}`}
          >
            <span className={`font-mono text-sm ${s.last ? "text-brass" : "text-brass"}`}>{s.n}</span>
            <span className="font-display text-xl">{s.title}</span>
            <p className={`text-sm leading-relaxed ${s.last ? "text-bone/70" : "text-muted"}`}>
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
