/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // This helps with Vercel deployment
  experimental: {
    // Optional: Add any experimental features if needed
  }
}

module.exports = nextConfig
