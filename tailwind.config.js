/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        obsidian: '#09090B',
        vector: '#00E5FF',
        amber: {
          400: '#FFB100',
        },
        crimson: {
          500: '#FF2A5F',
        }
      }
    },
  },
  plugins: [],
}
