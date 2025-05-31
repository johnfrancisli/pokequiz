/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float-up': 'floatUp 1s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'attack-right': 'attackRight 0.5s ease-in-out',
        'attack-left': 'attackLeft 0.5s ease-in-out',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(-20px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        },
        attackRight: {
          '0%': { transform: 'rotate(45deg) translateX(0)' },
          '50%': { transform: 'rotate(45deg) translateX(10px)' },
          '100%': { transform: 'rotate(45deg) translateX(0)' },
        },
        attackLeft: {
          '0%': { transform: 'rotate(-45deg) translateX(0)' },
          '50%': { transform: 'rotate(-45deg) translateX(-10px)' },
          '100%': { transform: 'rotate(-45deg) translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};