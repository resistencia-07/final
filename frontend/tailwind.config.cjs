// NOTE: Tailwind v4 no longer reads color tokens from this file automatically.
// The nd.* palette is now defined via the @theme block in src/tailwind.css
// (source of truth). This file is kept only for editor tooling / reference
// and is not wired up via @config.
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        nd: {
          primary: '#FF6B9D',
          secondary: '#8B5CF6',
          accent: '#38BDF8',
          deep: '#4C1D95',
          bg: '#08090D'
        }
      },
    },
  },
  plugins: [],
}
