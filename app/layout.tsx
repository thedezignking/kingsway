import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Type system (frontend-design pass): Fraunces = warm literary display ("mentor & friend"),
// Hanken Grotesk = friendly humanist body, IBM Plex Mono = builder-flavored labels/dates/cadence.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Kingsway — a community for young builders",
  description:
    "Kingsway is a community for young builders. Once a month, we gather for one honest conversation at KingsHour.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Never leave scroll-reveal content hidden if JS is disabled. */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} bg-surface font-sans text-fg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
