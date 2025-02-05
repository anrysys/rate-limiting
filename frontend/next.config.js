/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com', 'github.com'],
  },
  experimental: {
    serverActions: {
      allowedForwardedHosts: ['localhost', '127.0.0.1'],
    },
  },
  // Add port configuration
  serverOptions: {
    port: 3111,
  },
};

module.exports = nextConfig;
