// Landing / FAQ (PRD §4.1). The five questions that remove hesitation. Native disclosure, warm rules.
const FAQS = [
  { q: "Is Kingsway free?", a: "Yes. Membership is free. You just become a King and show up." },
  {
    q: "Who is it for?",
    a: "Builders — anyone intentionally making something: a startup, product, skill, career, or personal brand.",
  },
  {
    q: "What happens after I join?",
    a: "You complete the King's Census, get a welcome, and start receiving KingsHour invites. That's it.",
  },
  {
    q: "What is KingsHour?",
    a: "A monthly online gathering on the last Sunday — real conversation, reflection, and accountability. Not a webinar.",
  },
  {
    q: "Why is there no WhatsApp group?",
    a: "Groups create noise. We use the founder's WhatsApp Status instead — presence without pressure.",
  },
];

export function FAQ() {
  return (
    <section className="py-16">
      <div className="hairline mb-12" />
      <p className="eyebrow">Questions</p>
      <h2 className="mt-6 font-display text-3xl">Before you join</h2>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
              {item.q}
              <span className="font-mono text-brass transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
