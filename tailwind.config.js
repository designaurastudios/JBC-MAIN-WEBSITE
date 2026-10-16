/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0D2438',
          'navy-dark': '#071827',
          'slate': '#344F65',
          'steel': '#58758A',
          'taupe': '#A99D8C',
          'beige': '#D8D0C4',
          'offwhite': '#F7F6F2',
          'water': '#1689C7',
          'water-dark': '#075E91',
          'text-dark': '#14202A',
          'text-body': '#3F4A52',
          'muted': '#68747D',
          'border': '#D9D5CE',
          'border-light': '#E8E5DF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(13, 36, 56, 0.05), 0 1px 2px rgba(13, 36, 56, 0.03)',
        'card': '0 4px 12px rgba(13, 36, 56, 0.06), 0 1px 3px rgba(13, 36, 56, 0.04)',
        'elevated': '0 12px 30px rgba(13, 36, 56, 0.08), 0 4px 8px rgba(13, 36, 56, 0.04)',
        'dropdown': '0 10px 25px -5px rgba(7, 24, 39, 0.1), 0 8px 10px -6px rgba(7, 24, 39, 0.1)',
      },
      letterSpacing: {
        'widest-subtle': '0.12em',
        'label': '0.15em',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
