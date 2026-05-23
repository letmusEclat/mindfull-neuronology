/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      colors: {
        surface: '#fff8f2',
        'surface-dim': '#e5d8c6',
        'surface-container': '#f9ecd9',
        'surface-container-low': '#fff2df',
        'surface-container-high': '#f3e6d4',
        'surface-container-highest': '#eee1ce',
        'surface-variant': '#eee1ce',
        'on-surface': '#211b0f',
        'on-surface-variant': '#4f4636',
        outline: '#817664',
        'outline-variant': '#d2c5b0',
        primary: '#4a6800',
        'on-primary': '#ffffff',
        'primary-container': '#b2e251',
        'on-primary-container': '#374e00',
        secondary: '#745b00',
        'on-secondary': '#ffffff',
        'secondary-container': '#facd3b',
        'on-secondary-container': '#6e5700',
        tertiary: '#8b501a',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#feb072',
        'on-tertiary-container': '#78400a',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        'breathe-aura': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.25' },
          '50%': { transform: 'scale(1.35)', opacity: '0.65' },
        },
        'breathe-mid': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
          '50%': { transform: 'scale(1.25)', opacity: '0.5' },
        },
        'breathe-inner': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        'neural-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 6px #facd3b)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'breathe-aura': 'breathe-aura 8s ease-in-out infinite',
        'breathe-mid': 'breathe-mid 8s ease-in-out infinite 0.5s',
        'breathe-inner': 'breathe-inner 8s ease-in-out infinite 1s',
        'neural-glow': 'neural-glow 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
      },
    },
  },
  plugins: [],
}

