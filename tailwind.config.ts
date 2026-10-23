import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';
import { buildThemedTailwindColors, buildThemeVariables } from './src/lib/theme/theme-palette';

const themeVariables = buildThemeVariables();

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: buildThemedTailwindColors(),
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': { ...themeVariables.light, colorScheme: 'light' },
        '.dark': { ...themeVariables.dark, colorScheme: 'dark' },
      });
    }),
  ],
};

export default config;
