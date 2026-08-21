/** @type {import('tailwindcss').Config} */
const tokens = require('./theme/tokens');

module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './App.tsx',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
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
        // Overrides Tailwind's default sans stack so any className with no
        // explicit font-poppinsX utility (or using font-sans) still renders
        // in Poppins instead of falling back to the OS system font.
        sans: [tokens.font.family.regular, 'sans-serif'],
        poppinsRegular: [tokens.font.family.regular, 'sans-serif'],
        poppinsMedium: [tokens.font.family.medium, 'sans-serif'],
        poppinsSemiBold: [tokens.font.family.semibold, 'sans-serif'],
        poppinsBold: [tokens.font.family.bold, 'sans-serif'],
        poppinsLight: [tokens.font.family.light, 'sans-serif'],
      },
    },
  },
  plugins: [],
};
