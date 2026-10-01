/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm near-black — deliberately neutral/brown undertone, never blue.
        charcoal: {
          DEFAULT: "#1A1612",
          50: "#F8F5EE", 100: "#EDE7D9", 200: "#D9CFB8", 300: "#B3A78F",
          400: "#8C7F6C", 500: "#665A4A", 600: "#4A4136", 700: "#332C23",
          800: "#241F19", 900: "#1A1612", 950: "#0F0C09",
        },
        // Brand gold, sampled from the real logo (#F5C319).
        gold: {
          DEFAULT: "#F5C319",
          50: "#FFFBEB", 100: "#FFF3C4", 200: "#FDE68A", 300: "#FBD758",
          400: "#F5C319", 500: "#DDA80E", 600: "#B8890A", 700: "#8F6907",
          800: "#664B05", 900: "#3D2C03",
        },
        // Warm cream, sampled from the real logo background (#FBFAF6).
        cream: { DEFAULT: "#FBFAF6", 50: "#FFFFFF", 100: "#FBFAF6", 200: "#F3EEE1", 300: "#EAE1CC" },
        ink: { DEFAULT: "#1F1B16", soft: "#5C5245", faint: "#8C8171" },
      },
      fontFamily: {
        display: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: { content: "1200px" },
      keyframes: {
        "fade-up": { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
      animation: { "fade-up": "fade-up 0.6s ease-out both" },
    },
  },
  plugins: [],
};
