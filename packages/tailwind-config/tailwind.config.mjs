/** @type {import('tailwindcss').Config} */
const config= {
   content: [
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../apps/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    '!../../**/node_modules',
    '!../../**/dist',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config;