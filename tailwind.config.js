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
          blush: '#EDE5D8',
          soft:  '#C9B49A',
          deep:  '#8B7355',
          dark:  '#6B5540',
        },
        nude: {
          light:  '#FAFAF6',
          base:   '#F2EBE0',
          medium: '#E0D5C4',
          dark:   '#9E8E7C',
        },
        gold: {
          light: '#F0E6D2',
          base:  '#C9A96E',
          dark:  '#A8884A',
        },
        charcoal: '#1A1512',
      },
      fontFamily: {
        playfair:    ['Playfair Display', 'serif'],
        poppins:     ['Poppins', 'sans-serif'],
        calligraphy: ['Great Vibes', 'cursive'],
      },
      backgroundImage: {
        'gradient-boutique': 'linear-gradient(135deg, #FAFAF6 0%, #EDE5D8 100%)',
      },
    },
  },
  plugins: [],
}
