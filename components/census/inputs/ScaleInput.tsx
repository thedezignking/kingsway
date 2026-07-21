// Census input — tap-one labeled scale (replaces the boring drag slider). One tap picks a value and
// auto-advances. Clearer and more satisfying than a slider for confidence/frequency questions.
"use client";

import type { SliderConfig } from "@/lib/census/copy";

export function ScaleInput({
  config,
  value,
  onChange,
  onPick,
}: {
  config: SliderConfig;
  value: unknown;
  onChange: (v: number) => void;
  onPick: () => void;
}) {
  const current = typeof value === "number" ? value : null;
  const steps: number[] = [];
  for (let v = config.min; v <= config.max; v += config.step) steps.push(v);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {steps.map((v) => {
          const active = current === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => {
                onChange(v);
                setTimeout(onPick, 160);
              }}
              className={`h-10 w-10 rounded-md border text-sm transition ${
                active
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-gray-300 hover:border-gray-500 dark:border-gray-700 dark:hover:border-gray-500"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{config.minLabel}</span>
        <span>{config.maxLabel}</span>
      </div>
    </div>
  );
}
