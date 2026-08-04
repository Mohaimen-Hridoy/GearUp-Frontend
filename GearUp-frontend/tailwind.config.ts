import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        "canvas-light": "var(--canvas-light)",
        paper: "var(--paper)",
        "paper-dim": "var(--paper-dim)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        moss: "var(--moss)",
        "moss-dark": "var(--moss-dark)",
        brass: "var(--brass)",
        "brass-dark": "var(--brass-dark)",
        rust: "var(--rust)",
        sky: "var(--sky)",
        line: "var(--line)",
        "line-canvas": "var(--line-canvas)",
      },
      fontFamily: {
        display: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
        tag: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "10px",
        DEFAULT: "14px",
        md: "18px",
      },
      maxWidth: {
        "6xl": "72rem",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
