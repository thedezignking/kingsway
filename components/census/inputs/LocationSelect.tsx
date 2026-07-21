// Census input — location on one screen (PRD §4.2 location, per Divine's UX call): pick the country,
// and a state field appears right under it. When the country has a known subdivision list
// (lib/geo/states.ts) it's a dropdown of that country's states/regions/counties; otherwise it falls
// back to a free-text "state or city" field. Value is { country, state_city }. Advance via Next.
"use client";

import { useEffect, useRef } from "react";
import { CountrySelect } from "./CountrySelect";
import { statesFor, subdivisionLabel } from "@/lib/geo/states";

interface LocationValue {
  country?: string;
  state_city?: string;
}

export function LocationSelect({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: LocationValue) => void;
}) {
  const v = (value as LocationValue) || {};
  const stateRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const states = statesFor(v.country);
  const label = subdivisionLabel(v.country);
  const hasList = states.length > 0;

  // When a country gets picked, move focus down to the state field/dropdown.
  useEffect(() => {
    if (!v.country) return;
    if (hasList) selectRef.current?.focus();
    else stateRef.current?.focus();
  }, [v.country, hasList]);

  return (
    <div className="flex flex-col gap-4">
      <CountrySelect
        value={v.country}
        // Switching country clears any stale state from the previous one.
        onChange={(name) => onChange({ country: name, state_city: undefined })}
        onPick={() => (hasList ? selectRef.current?.focus() : stateRef.current?.focus())}
      />

      {v.country && (
        <div className="flex flex-col gap-1">
          <label className="text-sm capitalize text-gray-500">Your {label}</label>
          {hasList ? (
            <select
              ref={selectRef}
              value={v.state_city ?? ""}
              onChange={(e) => onChange({ ...v, state_city: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-3 text-base outline-none focus:border-black dark:border-gray-700 dark:focus:border-white"
            >
              <option value="">Select your {label}…</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          ) : (
            <input
              ref={stateRef}
              type="text"
              value={v.state_city ?? ""}
              placeholder="e.g. Lagos"
              onChange={(e) => onChange({ ...v, state_city: e.target.value })}
              className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-3 text-base outline-none focus:border-black dark:border-gray-700 dark:focus:border-white"
            />
          )}
        </div>
      )}
    </div>
  );
}
