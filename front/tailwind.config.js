/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        snack: " rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px",
      },
      colors: {
        "snack-default": "#61DAFB",

        "snack-blue": "#2D3857",
        "snack-orange": "#EA6a62",
        "snack-sky": "#1f8ce6",
        "snack-pink": "#FF69b4",

        "snack-green-100": "#5a9e70",
        "snack-green-200": "#344b3c",

        "snack-gray-100": "#CFD2D6",
        "snack-gray-200": "#ACB3B9",
        "snack-gray-300": "#4a4e51",

        "snack-text": "hsl(210,8%,25%)",
        "snack-text-dark": "hsl(210,8%,82.5%)",

        "snack-gold-100": "hsl(48,100%,50%)",
        "snack-gold-200": "hsl(45,100%,47%)",
        "snack-gold-300": "hsl(48,22%,30%)",
        "snack-silver-100": "hsl(210,6%,72%)",
        "snack-silver-200": "hsl(210,3%,61%)",
        "snack-silver-300": "hsl(0,0%,26%)",
        "snack-bronze-100": "hsl(28,38%,67%)",
        "snack-bronze-200": "hsl(28,31%,52%)",
        "snack-bronze-300": "hsl(28,13%,27%)",
      },
    },
  },
  plugins: [],
};
