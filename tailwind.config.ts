import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "slide-in-from-right-4": {
          "0%": { transform: "translateX(1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-from-left-4": {
          "0%": { transform: "translateX(-1rem)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-in-from-right-4": "slide-in-from-right-4 300ms ease-out",
        "slide-in-from-left-4": "slide-in-from-left-4 300ms ease-out",
        "fade-in": "fade-in 300ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
