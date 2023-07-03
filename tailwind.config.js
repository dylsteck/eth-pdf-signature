/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        code: ['Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}

