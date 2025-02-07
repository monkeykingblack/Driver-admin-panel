import type { Config } from 'tailwindcss';

// @ts-expect-error no need to define type here
import tailgrids from 'tailgrids/plugin';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    darkMode: 'class',
    fontFamily: {
      inter: ['Inter', 'sans-serif'],
    },
    screens: {
      xs: '400px',
      // => @media (min-width: 400px) { ... }

      sm: '540px',
      // => @media (min-width: 540px) { ... }

      md: '720px',
      // => @media (min-width: 720px) { ... }

      lg: '960px',
      // => @media (min-width: 960px) { ... }

      xl: '1140px',
      // => @media (min-width: 1240px) { ... }

      '2xl': '1320px',
      // => @media (min-width: 1320px) { ... }
    },
    container: {
      center: true,
      padding: '16px',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },

  plugins: [tailgrids],
} satisfies Config;
