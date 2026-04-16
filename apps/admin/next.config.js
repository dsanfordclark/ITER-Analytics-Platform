/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@iter/ui', '@iter/db'],
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
