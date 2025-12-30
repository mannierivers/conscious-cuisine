/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Adding a custom serif font for Chef Cary's high-end branding
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'], 
      },
      colors: {
        // You can define specific brand colors here if needed
        emerald: {
          50: '#ecfdf5',
          600: '#059669',
          700: '#047857',
        },
      },
    },
  },
  plugins: [
    // This is CRITICAL for the AI analysis text to look formatted and clean
    require('@tailwindcss/typography'),
  ],
}