/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          blush: '#F9D1DC',
          soft: '#EFA8BF',
          deep: '#D4688A',
          dark: '#B54E72',
        },
        nude: {
          light: '#FFF8F5',
          base: '#F5EDE3',
          medium: '#E8D5C4',
          dark: '#C9A896',
        },
        gold: {
          light: '#E8D5A3',
          base: '#C9A96E',
          dark: '#A8884A',
        },
        charcoal: '#2C2020',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-boutique': 'linear-gradient(135deg, #FFF8F5 0%, #F9D1DC 100%)',
      },
    },
  },
  plugins: [],
}
