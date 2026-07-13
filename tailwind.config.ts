import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad de marca Productos D'lemilia (tomada del logo)
        borgona: {
          DEFAULT: "#6E0F16",
          dark: "#560A10",
          light: "#8A1A22",
        },
        crema: {
          DEFAULT: "#F8F3EC",
          dark: "#EFE7DA",
        },
        dorado: {
          DEFAULT: "#C89A32",
          light: "#DCB559",
        },
        carbon: "#2B2B2B",
        gris: "#707070",
        // Acentos pastel suaves (estilo boutique) que armonizan con la marca
        sage: {
          DEFAULT: "#DDE6DC",
          dark: "#C9D6C6",
          text: "#3F4E3B",
        },
        blush: {
          DEFAULT: "#F6E7E3",
          dark: "#EFD8D2",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(43, 43, 43, 0.18)",
        card: "0 18px 50px -20px rgba(110, 15, 22, 0.25)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.9s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
