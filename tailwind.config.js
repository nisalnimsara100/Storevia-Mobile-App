/** @type {import('tailwindcss').Config} */
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
      fontFamily: {
        poppinsRegulary: ["PoppinsRegular", "sans-serif"],
        poppinsBold: ["PoppinsBold", "sans-serif"],
        poppinsMedium: ["PoppinsMedium", "sans-serif"],
        poppinsSemiBold: ["PoppinsSemiBold", "sans-serif"],
        poppinsLight: ["PoppinsLight", "sans-serif"],
      },
    },
  },
  plugins: [],
}