// Census / ChapterShell (PRD §4.2, §7). Chapter-level progress ("Chapter 3 of 6"), framed as
// becoming — a brass track with a crown riding the head. Screens advance one question at a time
// inside it. ~18 questions feel like 6 moves.
"use client";

import { Crown } from "@/components/shared/Crown";

export function ChapterShell({
  chapter,
  totalChapters,
  percent,
  children,
}: {
  chapter: number;
  totalChapters: number;
  percent: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <span className="eyebrow">
            Chapter {Math.min(chapter, totalChapters)} / {totalChapters}
          </span>
          <span className="font-mono text-xs text-brass">becoming a King · {percent}%</span>
        </div>
        <div className="relative h-1.5 w-full rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brass transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
          <span
            className="absolute -top-[7px] text-brass transition-all duration-500"
            style={{ left: `calc(${percent}% - 11px)` }}
            aria-hidden="true"
          >
            <Crown size={22} />
          </span>
        </div>
      </div>
      <div key={`${chapter}-${percent}`} className="anim-fade-up">
        {children}
      </div>
    </div>
  );
}
