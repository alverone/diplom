import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        laptop: '991px',
        xs: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config;
