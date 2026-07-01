/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: "#09090b", 2: "#111113", 3: "#18181b", 4: "#222226" },
        border: { DEFAULT: "#27272a", 2: "#3f3f46" },
        tx: { DEFAULT: "#f4f4f5", muted: "#71717a", dim: "#52525b" },
        brand: { DEFAULT: "#3b82f6", dark: "#1d4ed8", glow: "#60a5fa" },
        danger: { DEFAULT: "#ef4444", bg: "#450a0a", border: "#7f1d1d" },
        warn: { DEFAULT: "#f59e0b", bg: "#451a03", border: "#78350f" },
        ok: { DEFAULT: "#22c55e", bg: "#052e16", border: "#14532d" },
        violet: { DEFAULT: "#a78bfa", bg: "#2e1065", border: "#4c1d95" },
        cyan: "#06b6d4",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: {
        glow: "0 0 20px rgba(59,130,246,0.15)",
        danger: "0 0 20px rgba(239,68,68,0.15)",
      },
      animation: {
        pulse2: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        fadeIn: "fadeIn .25s ease",
        slideUp: "slideUp .3s ease",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
