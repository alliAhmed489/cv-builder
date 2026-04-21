export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        navy: {
          50: '#eeeef7', 100: '#c5c5e5', 200: '#9c9cd2',
          300: '#7373bf', 400: '#4a4aac', 500: '#1a1a2e',
          600: '#16162a', 700: '#121226', 800: '#0e0e22', 900: '#0a0a1e',
        },
        gold: {
          50: '#fdf8ec', 100: '#f9eccc', 200: '#f0d48a',
          300: '#e8bb48', 400: '#c9a84c', 500: '#b08d35',
          600: '#8b6914', 700: '#6b500e', 800: '#4b3808', 900: '#2b2004',
        },
      },
    },
  },
  plugins: [],
}