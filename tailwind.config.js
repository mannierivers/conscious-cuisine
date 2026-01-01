/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // High-end serif for Chef Cary's quotes and titles
        serif: ['var(--font-serif)', 'serif'],
        // Clean sans for clinical data
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // The "Health" Anchor: Deep, calming greens
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          500: '#10b981',
          600: '#059669', // Primary Button
          700: '#047857',
          800: '#065f46',
          900: '#064e3b', // Header/Footer backgrounds
        },
        // The "Science" Anchor: Crisp, clinical blues
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Molecular Synergy color
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        // The "Impact" Anchor: Sophisticated clinical pinks/reds
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48', // Target Condition color
          700: '#be123c',
        },
        // The "Background" Anchor: Professional slates
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          400: '#94a3b8',
          500: '#64748b',
          800: '#1e293b',
          900: '#0f172a', // Deepest Slate for dark sections
        },
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}