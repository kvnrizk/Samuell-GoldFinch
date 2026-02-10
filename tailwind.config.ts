import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      colors: {
        ivory: '#f7f7f5',
        brandbeige: '#d3cfc5',
        midnight: '#09090b',
        gold: '#c8a96e',
        'gold-dim': '#9a7d4e',
        graylux: '#7f7f7f',
      },
      spacing: {
        header: '72px',
        'header-mobile': '60px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1.5', letterSpacing: '0.4em' }],
      },
      animation: {
        'grain': 'grain 8s steps(10) infinite',
        'float-1': 'float1 20s ease-in-out infinite',
        'float-2': 'float2 25s ease-in-out infinite',
        'float-3': 'float3 18s ease-in-out infinite',
        'scroll-band': 'scrollBand 30s linear infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '30%': { transform: 'translate(3%, -15%)' },
          '50%': { transform: 'translate(12%, 9%)' },
          '70%': { transform: 'translate(9%, 4%)' },
          '90%': { transform: 'translate(-1%, 7%)' },
        },
        float1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        float2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-40px, 30px) scale(1.05)' },
          '66%': { transform: 'translate(25px, -40px) scale(0.95)' },
        },
        float3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(20px, 40px) scale(1.08)' },
          '66%': { transform: 'translate(-30px, -20px) scale(0.92)' },
        },
        scrollBand: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
