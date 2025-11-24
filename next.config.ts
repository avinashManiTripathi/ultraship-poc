import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Completely disable static page generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
