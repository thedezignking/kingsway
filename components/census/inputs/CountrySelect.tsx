// Census input — searchable country select (PRD §4.2: searchable select over the country list).
// Type to filter; pick to set + auto-advance. Stores the country name.
"use client";

import { useEffect, useRef, useState } from "react";
import { searchCountries } from "@/lib/geo/countries";

export function CountrySelect({
  value,
  onChange,
  onPick,
}: {
  value: unknown;
  onChange: (v: string) => void;
  onPick: () => void;
}) {
  const selected = typeof value === "string" ? value : "";
  const [query, setQuery] = useState(selected);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const results = searchCountries(query);

  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        value={query}
        placeholder="Start typing your country…"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-3 text-base outline-none focus:border-black dark:border-gray-700 dark:focus:border-white"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-black">
          {results.map((c) => (
            <li key={c.iso2}>
              <button
                type="button"
                onClick={() => {
                  onChange(c.name);
                  setQuery(c.name);
                  setOpen(false);
                  setTimeout(onPick, 160);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <span>{c.name}</span>
                <span className="text-xs text-gray-400">+{c.dial}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
