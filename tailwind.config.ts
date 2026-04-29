import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 12px 32px rgba(15, 23, 42, 0.08)",
        card: "0 10px 30px rgba(15, 23, 42, 0.07)",
      },
      colors: {
        navy: "#1A3C6E",
        gold: "#C9952A",
        brand: {
          50: "#F8FAFC",
          100: "#E2E8F0",
          500: "#C89B3C",
          900: "#0F172A",
        },
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        info: "#2563EB",
        muted: "#64748B",
        surface: "#FFFFFF",
      },
      fontFamily: {
        sans: ["Open Sans", "system-ui", "sans-serif"],
        heading: ["Montserrat", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "dashboard-glow":
          "radial-gradient(circle at top left, rgba(200, 155, 60, 0.15), transparent 35%), radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 25%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
