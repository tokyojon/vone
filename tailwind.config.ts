import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#ec6d13",
        "background-light": "#f8f7f6",
        "background-dark": "#221810",
        "text-light-primary": "#181411",
        "text-light-secondary": "#897261",
        "text-dark-primary": "#f8f7f6",
        "text-dark-secondary": "#a8a29e",
        "surface-light": "#ffffff",
        "surface-dark": "#2d231a",
        "border-light": "#f4f2f0",
        "border-dark": "#3f3328",
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans JP', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
    },
  },
  plugins: [],
};
export default config;
