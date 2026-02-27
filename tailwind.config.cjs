/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Backgrounds (dark theme)
        bg: {
          primary: '#202533',
          secondary: '#363849',
          darker: '#1a1d28',
          black: '#202020',
        },
        // Neon accents (cyber aesthetic)
        neon: {
          purple: '#6303f3',
          cyan: '#51d6f9',
          yellow: '#ecfb00',
          purpleDark: '#7d01be',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(99, 3, 243, 0.3)',
        'glow-cyan': '0 0 20px rgba(81, 214, 249, 0.3)',
        'glow-yellow': '0 0 15px rgba(236, 251, 0, 0.2)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
