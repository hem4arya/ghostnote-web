/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx,css}"
  ],
  theme: {
    extend: {
      colors: {
        'ghost': {
          'black': '#0a0a0a',
          'dark': '#1a1a1a',
          'gray': '#2a2a2a',
          'purple': '#6b46c1',
          'neon': '#00ff41',
          'red': '#ff073a',
          'cyan': '#00ffff',
        },
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'tech': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 2s infinite',
        'typewriter': 'typewriter 3s steps(40, end) forwards',
        'glitch': 'glitch 1s infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}

