/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'float-up': 'floatUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'shake': 'shake 0.3s cubic-bezier(0.36, 0, 0.66, -0.56)',
        'attack-right': 'attackRight 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        'attack-left': 'attackLeft 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '60%': { opacity: 1, transform: 'translateY(-25px)' },
          '100%': { opacity: 1, transform: 'translateY(-20px) scale(1.05)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px) rotate(-3deg)' },
          '50%': { transform: 'translateX(8px) rotate(3deg)' },
          '75%': { transform: 'translateX(-6px) rotate(-2deg)' },
        },
        attackRight: {
          '0%': { transform: 'rotate(0deg) translateX(0)' },
          '50%': { transform: 'rotate(-20deg) translateX(20px) scale(1.1)' },
          '100%': { transform: 'rotate(0deg) translateX(0)' },
        },
        attackLeft: {
          '0%': { transform: 'rotate(0deg) translateX(0)' },
          '50%': { transform: 'rotate(20deg) translateX(-20px) scale(1.1)' },
          '100%': { transform: 'rotate(0deg) translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};