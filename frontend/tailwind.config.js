/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        immo: {
          green: '#008080',
          'green-dark': '#006666',
          orange: '#F28500',
          'orange-dark': '#D97706',
          beige: '#F5F0E8',
          'beige-dark': '#E8DFD0',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        search: '0 12px 48px rgba(0, 0, 0, 0.12)',
        card: '0 4px 32px rgba(0, 0, 0, 0.06)',
        pill: '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        search: '20px',
      },
    },
  },
  plugins: [],
}
