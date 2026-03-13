import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        chirp: ["var(--font-chirp)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
