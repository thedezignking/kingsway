// Census / ChapterIntro (PRD §4.2 #2). Chapters 1–5 open with a short reflective statement
// (~5–8s read, one tap to continue). Chapter 6 has none.
"use client";

import { chapterIntro } from "@/lib/census/copy";

export function ChapterIntro({
  chapter,
  firstName,
  chapterLabel,
  onContinue,
}: {
  chapter: number;
  firstName?: string;
  chapterLabel: string;
  onContinue: () => void;
}) {
  const copy = chapterIntro(chapter, firstName);
  if (!copy) return null;
  return (
    <div className="flex flex-col gap-6">
      <p className="eyebrow">{chapterLabel}</p>
      <div className="flex flex-col gap-3">
        <h2 className="text-balance font-display text-3xl leading-tight sm:text-4xl">
          {copy.title}
        </h2>
        <p className="text-pretty text-lg leading-relaxed text-muted">{copy.body}</p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="mt-1 w-fit rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-surface transition duration-200 hover:-translate-y-px hover:opacity-90 active:translate-y-0"
      >
        Continue
      </button>
    </div>
  );
}
