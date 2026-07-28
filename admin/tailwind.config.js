/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#2A2A22",
          beige: "#F4F2EA",
          olive: "#5C6B44",
          burgundy: "#722F37",
        },
        // Added the specific shades used in AdminLogin:
        oliveDark: "#3E4930",
        oliveDeep: "#2c3322",
        lightBeige: "#F6F1E3",
        goldAccent: "#B8935B",
        cardBeige: "#E7D9C9",
      }
    },
  },
  plugins: [],
}