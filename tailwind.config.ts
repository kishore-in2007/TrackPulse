import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          dark: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0",
          accent: "#0284c7",
          warning: "#d97706",
          danger: "#dc2626",
          success: "#16a34a",
          muted: "#64748b",
        },
        irctc: {
          blue: "#082b4c",
          navy: "#002244",
          header: "#0b3b60",
          primary: "#0b3b60",
          saffron: "#ea580c",
          orange: "#f97316",
          amber: "#d97706",
          gold: "#d97706",
          card: "#ffffff",
          border: "#cbd5e1",
          light: "#f8fafc",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "rail-grid": "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
