/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — layered slate-navy, darkest at the page, lightest at inputs
        "bg-1": "#05070c",
        "bg-2": "#0a0e17",
        "bg-3": "#111726",
        "bg-4": "#171f31",

        // Hairlines
        border: "#1c2434",
        "border-2": "#2b3550",

        // Text
        tx: "#e7ebf5",
        "tx-h": "#f6f8fc",
        "tx-muted": "#8994ac",
        "tx-dim": "#525b71",

        // Signal cyan — the operator's "live" color
        brand: "#00d4ff",
        "brand-bg": "rgba(0, 212, 255, 0.08)",
        "brand-border": "rgba(0, 212, 255, 0.28)",

        // Status
        danger: "#f2415a",
        "danger-bg": "rgba(242, 65, 90, 0.08)",
        "danger-border": "rgba(242, 65, 90, 0.3)",

        warn: "#f2a93c",
        "warn-bg": "rgba(242, 169, 60, 0.08)",
        "warn-border": "rgba(242, 169, 60, 0.3)",

        ok: "#18c58f",
        "ok-bg": "rgba(24, 197, 143, 0.08)",
        "ok-border": "rgba(24, 197, 143, 0.3)",

        violet: "#8f6cf2",
        "violet-bg": "rgba(143, 108, 242, 0.08)",
        "violet-border": "rgba(143, 108, 242, 0.3)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0, 212, 255, 0.35), 0 0 24px rgba(0, 212, 255, 0.18)",
        "glow-danger": "0 0 0 1px rgba(242, 65, 90, 0.35), 0 0 24px rgba(242, 65, 90, 0.18)",
        panel: "0 1px 0 rgba(255,255,255,0.02) inset, 0 12px 24px -12px rgba(0,0,0,0.5)",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        pulse2: {
          "0%, 100%": { opacity: 1, boxShadow: "0 0 0 0 rgba(24,197,143,0.5)" },
          "50%": { opacity: 0.6, boxShadow: "0 0 0 4px rgba(24,197,143,0)" },
        },
        scan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 40px" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out both",
        slideUp: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both",
        pulse2: "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
