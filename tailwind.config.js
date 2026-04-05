/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        es: {
          dark: '#0a0a0f',
          card: '#12121a',
          border: '#1e1e2e',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
          text: '#e2e8f0',
          muted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
