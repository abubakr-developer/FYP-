/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float-1': 'float 6s ease-in-out infinite',
        'float-2': 'float 8s ease-in-out infinite 2s',
        'float-3': 'float 7s ease-in-out infinite 1s',
        'fade-in': 'fadeIn 1s ease-in',
        'fade-in-delay': 'fadeIn 1s ease-in 0.5s forwards',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    }
  },
  plugins: [],
}