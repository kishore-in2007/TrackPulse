import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          dark: "#081b2e",
          card: "#0d233a",
          border: "#1a3a5f",
          accent: "#38bdf8",
          warning: "#f59e0b",
          danger: "#ef4444",
          success: "#10b981",
          muted: "#94a3b8",
        },
        irctc: {
          blue: "#082b4c",
          navy: "#002244",
          header: "#0f3b68",
          primary: "#0f3b68",
          saffron: "#f25b04",
          orange: "#ff6700",
          amber: "#f59e0b",
          gold: "#fbbf24",
          card: "#0a2238",
          border: "#16426f",
          light: "#f1f5f9",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "rail-grid": "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
