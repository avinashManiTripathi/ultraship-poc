import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    // Disable static optimization for dynamic pages
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
