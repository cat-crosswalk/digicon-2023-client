/** @type {import('next').NextConfig} */
/** @type {import('next-pwa')} */

const withPWA = require('next-pwa')({
  dest: 'public',
})

const nextConfig = withPWA({
  reactStrictMode: true,
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    // const fileLoaderRule = config.module.rules.find(rule =>
    //   rule.test?.test?.('.svg')
    // )

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        // ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        // issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }
    )
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    })

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    // fileLoaderRule.exclude = /\.svg$/i

    return config
  },
})

module.exports = nextConfig
