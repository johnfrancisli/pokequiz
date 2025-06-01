/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float-up': 'floatUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'shake': 'shake 0.4s cubic-bezier(0.36, 0, 0.66, -0.56)',
        'attack-right': 'attackRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'attack-left': 'attackLeft 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '50%': { opacity: 1 },
          '100%': { opacity: 1, transform: 'translateY(-20px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px) rotate(-2deg)' },
          '50%': { transform: 'translateX(8px) rotate(2deg)' },
          '75%': { transform: 'translateX(-4px) rotate(-1deg)' },
        },
        attackRight: {
          '0%': { transform: 'rotate(0deg) translateX(0)' },
          '50%': { transform: 'rotate(-15deg) translateX(15px)' },
          '100%': { transform: 'rotate(0deg) translateX(0)' },
        },
        attackLeft: {
          '0%': { transform: 'rotate(0deg) translateX(0)' },
          '50%': { transform: 'rotate(15deg) translateX(-15px)' },
          '100%': { transform: 'rotate(0deg) translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};