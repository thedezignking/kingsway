// Census input — phone with a dial-code prefix (PRD §4.2: country code seeded, editable; store E.164).
// The dial code defaults from the country the King picked the screen before. Emits "+<dial><digits>".
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DIAL_CODES, dialForCountry } from "@/lib/geo/countries";

export function PhoneInput({
  value,
  country,
  placeholder,
  onChange,
}: {
  value: unknown;
  country?: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const defaultDial = useMemo(() => dialForCountry(country) ?? "234", [country]);

  // Best-effort parse of an existing stored value ("+234801..." -> dial 234, national 801...).
  const parsed = useMemo(() => parsePhone(typeof value === "string" ? value : ""), [value]);
  const [dial, setDial] = useState(parsed.dial || defaultDial);
  const [national, setNational] = useState(parsed.national);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  // Keep the dial in sync with the chosen country until the user has typed a number.
  useEffect(() => {
    if (!national) setDial(defaultDial);
  }, [defaultDial, national]);

  function emit(nextDial: string, nextNational: string) {
    const digits = nextNational.replace(/\D/g, "");
    onChange(digits ? `+${nextDial}${digits}` : "");
  }

  return (
    <div className="flex gap-2">
      <select
        value={dial}
        onChange={(e) => {
          setDial(e.target.value);
          emit(e.target.value, national);
        }}
        className="rounded-md border border-gray-300 bg-transparent px-2 py-3 text-base outline-none focus:border-black dark:border-gray-700 dark:focus:border-white"
      >
        {DIAL_CODES.map((d) => (
          <option key={d.dial} value={d.dial}>
            {d.label}
          </option>
        ))}
      </select>
      <input
        ref={ref}
        type="tel"
        value={national}
        placeholder={placeholder}
        onChange={(e) => {
          setNational(e.target.value);
          emit(dial, e.target.value);
        }}
        className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-3 text-base outline-none focus:border-black dark:border-gray-700 dark:focus:border-white"
      />
    </div>
  );
}

function parsePhone(v: string): { dial: string; national: string } {
  const m = v.match(/^\+(\d{1,4})(\d*)$/);
  if (m) return { dial: m[1], national: m[2] };
  return { dial: "", national: v.replace(/^\+/, "") };
}
