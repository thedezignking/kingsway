// Census / QuestionScreen (PRD §4.2). One question (one idea) per screen. Renders the right input
// variant. Single-selects (chip_single, radio, country_select, scale) auto-advance; multi/text/
// calendar show a Next button (the user decides when done).
"use client";

import { useEffect, useRef } from "react";
import type { CensusQuestion } from "@/lib/census/types";
import { questionPrompt, questionHelper, questionPlaceholder, sliderConfig } from "@/lib/census/copy";
import { CountrySelect } from "./inputs/CountrySelect";
import { LocationSelect } from "./inputs/LocationSelect";
import { PhoneInput } from "./inputs/PhoneInput";
import { ScaleInput } from "./inputs/ScaleInput";

interface Props {
  question: CensusQuestion;
  value: unknown;
  error: string | null;
  chapterLabel: string;
  /** Other answers so far — e.g. the phone input reads `country` to seed its dial code. */
  context?: Record<string, unknown>;
  onChange: (value: unknown) => void;
  /** Called by single-selects to advance immediately after a choice. */
  onAutoAdvance: () => void;
  onNext: () => void;
  onBack: () => void;
  canGoBack: boolean;
  isLast: boolean;
}

export function QuestionScreen({
  question,
  value,
  error,
  chapterLabel,
  context,
  onChange,
  onAutoAdvance,
  onNext,
  onBack,
  canGoBack,
  isLast,
}: Props) {
  const helper = questionHelper(question.id);
  const showNext = question.autoAdvance === false;

  return (
    <div className="flex flex-col gap-6">
      <p className="eyebrow">{chapterLabel}</p>
      <div className="flex flex-col gap-2">
        <h2 className="font-sans text-2xl font-semibold leading-snug tracking-tight sm:text-[1.7rem]">
          {questionPrompt(question.id)}
        </h2>
        {helper && <p className="text-sm text-muted">{helper}</p>}
      </div>

      <Input
        question={question}
        value={value}
        context={context}
        onChange={onChange}
        onAutoAdvance={onAutoAdvance}
      />

      {error && <p className="text-sm text-red-700 dark:text-red-400">{error}</p>}

      <div className="mt-2 flex items-center gap-3">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted transition hover:text-fg"
          >
            Back
          </button>
        )}
        {showNext && (
          <button
            type="button"
            onClick={onNext}
            className="ml-auto rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-surface transition duration-200 hover:-translate-y-px hover:opacity-90 active:translate-y-0"
          >
            {isLast ? "Finish" : "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}

function Input({
  question,
  value,
  context,
  onChange,
  onAutoAdvance,
}: {
  question: CensusQuestion;
  value: unknown;
  context?: Record<string, unknown>;
  onChange: (v: unknown) => void;
  onAutoAdvance: () => void;
}) {
  switch (question.input) {
    case "country_select":
      return <CountrySelect value={value} onChange={onChange} onPick={onAutoAdvance} />;

    case "location":
      return <LocationSelect value={value} onChange={onChange} />;

    case "tel": {
      const loc = context?.location as { country?: string } | undefined;
      return (
        <PhoneInput
          value={value}
          country={loc?.country}
          placeholder={questionPlaceholder(question.id)}
          onChange={onChange}
        />
      );
    }

    case "scale":
      return (
        <ScaleInput
          config={sliderConfig(question.id)}
          value={value}
          onChange={onChange}
          onPick={onAutoAdvance}
        />
      );

    case "chip_single":
    case "radio":
      return (
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setTimeout(onAutoAdvance, 160);
              }}
              className={chipClass(value === opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      );

    case "chip_multi": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      const atMax = question.maxSelect ? selected.length >= question.maxSelect : false;
      return (
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => {
            const on = selected.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                disabled={!on && atMax}
                onClick={() =>
                  onChange(
                    on ? selected.filter((v) => v !== opt.value) : [...selected, opt.value],
                  )
                }
                className={chipClass(on) + (!on && atMax ? " opacity-40" : "")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      );
    }

    case "slider": {
      const cfg = sliderConfig(question.id);
      const current = typeof value === "number" ? value : Math.round((cfg.min + cfg.max) / 2);
      return (
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={cfg.min}
            max={cfg.max}
            step={cfg.step}
            value={current}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-brass"
          />
          <div className="flex justify-between text-xs text-muted">
            <span>{cfg.minLabel}</span>
            <span>{cfg.maxLabel}</span>
          </div>
        </div>
      );
    }

    case "calendar": {
      const v = (value as { month?: number; day?: number }) || {};
      return (
        <div className="flex gap-2">
          <select
            value={v.month ?? ""}
            onChange={(e) => onChange({ ...v, month: Number(e.target.value) })}
            className={selectClass}
          >
            <option value="">Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={v.day ?? ""}
            onChange={(e) => onChange({ ...v, day: Number(e.target.value) })}
            className={selectClass}
          >
            <option value="">Day</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      );
    }

    case "long_text":
      return (
        <textarea
          autoFocus
          value={typeof value === "string" ? value : ""}
          placeholder={questionPlaceholder(question.id)}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={textInputClass}
        />
      );

    case "email":
    case "text":
    default:
      return (
        <AutoFocusInput
          type={question.input === "email" ? "email" : "text"}
          value={typeof value === "string" ? value : ""}
          placeholder={questionPlaceholder(question.id)}
          onChange={onChange}
        />
      );
  }
}

function AutoFocusInput({
  type,
  value,
  placeholder,
  onChange,
}: {
  type: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={textInputClass}
    />
  );
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const textInputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base outline-none transition focus:border-brass";
const selectClass =
  "rounded-xl border border-line bg-surface px-3 py-2.5 text-base outline-none transition focus:border-brass";

function chipClass(active: boolean): string {
  return `rounded-full border px-4 py-2 text-sm transition duration-150 active:scale-[0.97] ${
    active
      ? "border-brass bg-brass text-white"
      : "border-line bg-surface hover:-translate-y-px hover:border-brass/50 hover:bg-brass-soft/30"
  }`;
}
