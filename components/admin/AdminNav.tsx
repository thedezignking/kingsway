"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string; short: string };

export function AdminNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto p-3 md:block md:space-y-1" aria-label="Admin">
      {items.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`group flex shrink-0 items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm transition-colors ${
              active
                ? "border-brass bg-white/70 font-semibold text-fg"
                : "border-transparent text-muted hover:bg-white/50 hover:text-fg"
            }`}
          >
            <span className="font-mono text-[10px] tracking-wider text-muted/70">{item.short}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
