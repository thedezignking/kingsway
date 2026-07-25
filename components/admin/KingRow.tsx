// Admin / KingRow — makes a whole Kings-list row clickable. A stretched-link ::after doesn't span
// table cells (a <tr> doesn't create a containing block), so the row navigates on click via the
// router. The name stays a real <Link> for keyboard/screen-reader users; this only adds the
// mouse convenience of clicking anywhere on the row.
"use client";

import { useRouter } from "next/navigation";

export function KingRow({ href, children }: { href: string; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <tr
      onClick={(event) => {
        // Let real links/buttons and text selection behave normally.
        if ((event.target as HTMLElement).closest("a, button")) return;
        if (window.getSelection()?.toString()) return;
        router.push(href);
      }}
      className="cursor-pointer border-t border-line transition-colors first:border-t-0 hover:bg-[#f7f8fa]"
    >
      {children}
    </tr>
  );
}
