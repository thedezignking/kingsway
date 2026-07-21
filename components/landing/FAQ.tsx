import type { CSSProperties } from "react";

const FAQS = [
  {
    q: "What exactly am I joining?",
    a: "Kingsway is a community for young people who are building something and becoming someone in the process. We gather once a month at KingsHour; everything else supports that rhythm.",
  },
  {
    q: "Do I need to be a founder?",
    a: "No. You might be building a business, career, product, skill, body of work or a different life. The common ground is that you are trying to move something forward.",
  },
  {
    q: "What happens at KingsHour?",
    a: "KingsHour is our monthly online conversation on the last Sunday. We look honestly at the month, talk through one useful topic, listen to one another, and then return to our work.",
  },
  {
    q: "Why do I need to complete the King’s Census?",
    a: "Because we would rather listen before we assume. It helps us understand the seasons, goals, obstacles and interests of the people coming into the room.",
  },
  {
    q: "What happens after I become a King?",
    a: "You receive a welcome note and the details for the next KingsHour by email. There is no member account to manage and no feed to keep up with.",
  },
  {
    q: "Is Kingsway free?",
    a: "Yes. Kingsway is free to join.",
  },
  {
    q: "Is there a WhatsApp group?",
    a: "No. We use email for the things that matter and WhatsApp Status for light reminders. Kingsway is designed to be present without becoming noisy.",
  },
];

export function FAQ() {
  return (
    <section className="faq-section mx-auto w-full max-w-3xl">
      <div className="faq-heading">
        <p className="journey-kicker">Good to know</p>
        <h2 className="mt-4 text-balance font-sans text-3xl font-medium tracking-[-0.015em] sm:text-5xl">
          Before you step in
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted">
          Kingsway is simple by design. Here is what that means before you become a King.
        </p>
      </div>

      <div className="faq-list mt-12 border-y border-line/80">
        {FAQS.map((item, index) => (
          <details
            key={item.q}
            className="faq-item group border-b border-line/80 last:border-b-0"
            style={{ "--faq-order": index } as CSSProperties}
          >
            <summary className="faq-summary flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 font-medium [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <span className="faq-plus font-mono text-xl text-brass" aria-hidden="true">+</span>
            </summary>
            <div className="faq-answer">
              <p className="max-w-2xl pb-6 pr-12 text-[0.95rem] leading-relaxed text-muted">
                {item.a}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
