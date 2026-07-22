import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Type system: Hanken Grotesk carries the public voice; IBM Plex Mono is reserved for
// builder-flavoured labels, dates, and cadence. No serif/display face in the product.
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://kingsway.thedezignking.com",
  ),
  title: "Kingsway — A community for young builders",
  description:
    "We gather once a month at KingsHour for honest conversation about the work and the person building it.",
  openGraph: {
    type: "website",
    siteName: "Kingsway",
    url: "/",
    title: "Kingsway — A community for young builders",
    description:
      "We gather once a month at KingsHour for honest conversation about the work and the person building it.",
    images: [
      {
        url: "/images/social/kingsway-open-graph.png",
        width: 1200,
        height: 630,
        alt: "Kingsway — A community for young builders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kingsway — A community for young builders",
    description:
      "We gather once a month at KingsHour for honest conversation about the work and the person building it.",
    images: ["/images/social/kingsway-open-graph.png"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#FCFCFA",
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
        className={`${sans.variable} ${mono.variable} bg-surface font-sans text-fg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
