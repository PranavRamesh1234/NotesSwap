/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'rich-black': '#03071e',
        'chocolate-cosmos': '#370617',
        'rosewood': '#6a040f',
        'penn-red': '#9d0208',
        'engineering-orange': '#d00000',
        'sinopia': '#dc2f02',
        'persimmon': '#e85d04',
        'princeton-orange': '#f48c06',
        'orange-web': '#faa307',
        'selective-yellow': '#ffba08',
        'modern-gray': '#1e1e2f',
        'modern-blue': '#3b82f6',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        slideUp: 'slideUp 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      boxShadow: {
        floating: '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};