/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/thato-dev-portfolio',
  assetPrefix: '/thato-dev-portfolio',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
