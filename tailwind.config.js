/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        muted: "var(--color-muted)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        charcoal: "var(--color-charcoal)",
        sand: "var(--color-sand)",
        cream: "var(--color-cream)",
        gold: "var(--color-gold)",
        background: "var(--color-background)",
        backgroundTransparent: "var(--color-background-transparent)",
        rust: "var(--color-rust)",
        "rust-light": "var(--color-rust-light)",
        stone: "var(--color-stone)",
      },
      keyframes: {
        "gift-in": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "gift-in": "gift-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
