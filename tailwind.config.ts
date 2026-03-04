import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        surfaceElevated: '#f5f5f5',
        muted: '#737373',
        border: '#e5e5e5',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', '-apple-system', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
