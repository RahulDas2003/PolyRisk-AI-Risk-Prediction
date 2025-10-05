/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "AIzaSyCRfKwrBVo9aMj6mrXsRpvwPIkMCwd3Bpw",
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
