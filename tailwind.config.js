/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: '#0f172a',
        accent: '#0ea5e9',
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
