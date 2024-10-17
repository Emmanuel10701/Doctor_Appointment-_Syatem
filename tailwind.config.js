module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}', // Adjust this path based on your file structure
    './public/index.html', // Include your HTML files if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          overflow: 'hidden',
          '-ms-overflow-style': 'none', // Internet Explorer and Edge
          'scrollbar-width': 'none', // Firefox
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none', // Safari and Chrome
        },
      });
    },
  ],}
