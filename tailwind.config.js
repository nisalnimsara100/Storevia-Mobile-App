/** @type {import('tailwindcss').Config} */
const tokens = require("./theme/tokens");

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: tokens.color.primary,
        secondary: tokens.color.secondary,
        success: tokens.color.success,
        danger: tokens.color.danger,
        warning: tokens.color.warning,
        neutral: tokens.color.neutral,
      },
      borderRadius: tokens.radius,
      fontFamily: {
        poppinsRegular: [tokens.font.family.regular, "sans-serif"],
        poppinsMedium: [tokens.font.family.medium, "sans-serif"],
        poppinsSemiBold: [tokens.font.family.semibold, "sans-serif"],
        poppinsBold: [tokens.font.family.bold, "sans-serif"],
        poppinsLight: [tokens.font.family.light, "sans-serif"],
        // Deprecated alias for the original misspelled key — remove once
        // a repo-wide grep confirms zero className usages of it.
        poppinsRegulary: [tokens.font.family.regular, "sans-serif"],
      },
    },
  },
  plugins: [],
}