/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Peaceful" Palette
        sage: {
          100: '#EDF1EE', // Very light green for backgrounds
          500: '#84A98C', // Your primary Sage Green button/card color
          600: '#6B8F73', // Hover state
        },
        cream: '#F9F7F2', // Off-white background (easy on eyes)
        stone: '#2F3E46', // Softer alternative to black text
        danger: '#E76F51', // Soft red for "You Owe"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Ensure you have a clean font imported
      }
    },
  },
  plugins: [],
}