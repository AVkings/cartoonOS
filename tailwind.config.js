/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          pink: '#FF90E8',
          blue: '#90C2FF',
          yellow: '#FFDE90',
          green: '#90FF90',
          red: '#FF9090',
          bg: '#FDFBF7'
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(0,0,0,1)',
        'neo-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        'neo': '3px',
      },
      fontFamily: {
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
