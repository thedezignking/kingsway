"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icons";

type NavItem = { href: string; label: string; icon: IconName };

export function AdminNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto p-3 md:block md:space-y-0.5" aria-label="Admin">
      {items.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const Glyph = Icon[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-brass-soft/60 font-semibold text-fg"
                : "text-muted hover:bg-white hover:text-fg"
            }`}
          >
            <span className={active ? "text-brass" : "text-muted"}>
              <Glyph size={18} />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
