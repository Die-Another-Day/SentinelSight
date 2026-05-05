import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 45px rgba(46, 227, 164, 0.18)",
      },
      colors: {
        sentinel: {
          900: "#020406",
          800: "#071017",
          700: "#0c1920",
          500: "#2ee3a4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
