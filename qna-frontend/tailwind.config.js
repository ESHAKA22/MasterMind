/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#198754', // Dark Green
        'light-green': '#d1e7dd',   // Light Green
        'dark-green': '#1b5e20',    // Deep Green
        'white': '#ffffff',
        'light-gray': '#f8f9fa',
        'dark-gray': '#212529',
      },
    },
  },
  plugins: [],
}

