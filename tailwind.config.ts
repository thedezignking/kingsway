import type { Config } from "tailwindcss";

// Kingsway design tokens ("Brass & Ink"). Semantic, CSS-variable backed so light/dark flip in
// globals.css without touching component classes. One bold place: brass.
const config: Config = {
  // Light only for now: darkMode "class" (never added) neutralizes any `dark:` variants.
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)", //   page background (warm porcelain)
        "surface-2": "var(--surface-2)", // cards / alt sections
        fg: "var(--fg)", //             primary text
        muted: "var(--muted)", //       secondary text
        line: "var(--line)", //         hairlines / borders
        ink: "var(--ink)", //           deep royal indigo (always-dark surfaces)
        bone: "var(--bone)", //         light text on ink
        brass: "var(--accent)", //      the jewel: crown, primary CTA, focus
        "brass-soft": "var(--accent-soft)", // brass tints (selected chip, halos)
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23,21,46,0.04), 0 14px 40px -20px rgba(23,21,46,0.22)",
        card: "0 1px 0 rgba(23,21,46,0.03), 0 2px 6px rgba(23,21,46,0.05)",
        brass: "0 0 0 1px rgba(188,124,51,0.25), 0 8px 30px -12px rgba(188,124,51,0.5)",
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
    },
  },
  plugins: [],
};
export default config;
