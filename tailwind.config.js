/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: '#131316',
          900: '#0D0D0F',
          800: '#131316',
          700: '#1C1C21',
          600: '#232329',
          500: '#2C2C33',
        },
        ink: '#F4F3EE',
        muted: '#8B8B94',
        signal: {
          DEFAULT: '#D6FF3F',
          dim: '#AACB2E',
        },
        ember: '#FF5A36',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'plate-grid':
          'radial-gradient(circle at 1px 1px, rgba(244,243,238,0.06) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
}
