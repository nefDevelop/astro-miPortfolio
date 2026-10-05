import { fontMono } from "./src/styles/fonts";

/** @type {import('tailwindcss').Config} */
export default {
  // La clase `dark` la fija el script del <head> antes del primer paint.
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,ts,md,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        hair: "var(--hair)",
        dot: "var(--dot)",
      },
      fontFamily: {
        mono: fontMono,
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};