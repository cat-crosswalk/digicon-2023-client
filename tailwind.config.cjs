const plugin = require('tailwindcss/plugin')
const flattenColorPalette = require('tailwindcss/lib/util/flattenColorPalette')

const skeletonPlugin = plugin(({ matchComponents, theme }) => {
  matchComponents(
    {
      skeleton: value => [
        {
          overflow: 'hidden',
          position: 'relative',
        },
        {
          '&::before': {
            content: '""',
            width: '200%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            animation:
              'ghost-loading-slide 4500ms cubic-bezier(0.4, 0, 0.2, 1) -400ms infinite normal both running',
            background: `linear-gradient(
              90deg,
              transparent 10%,
              ${value} 45%,
              ${value} 70%,
              transparent 80%
            )`,
          },
        },
        {
          '&::after': {
            content: '""',
            width: '200%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            animation:
              'ghost-loading-slide 4500ms cubic-bezier(0.4, 0, 0.2, 1) 850ms infinite normal both running',
            background: `linear-gradient(
              90deg,
              transparent 10%,
              ${value} 45%,
              ${value} 70%,
              transparent 80%
            )`,
          },
        },
      ],
    },
    { values: flattenColorPalette.default(theme('colors')) }
  )
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  plugins: [skeletonPlugin],
}
