/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
          uniblue: {
          DEFAULT: '#0A0F2E',     // Azul escuro customizado
          light: '#1C234D',       // Versão mais clara
          dark: '#050817',        // Ainda mais escura
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
}

