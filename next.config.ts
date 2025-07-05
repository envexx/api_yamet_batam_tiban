import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.yametbatamtiban.id',
  },
  
  // Disable React strict mode for production
  reactStrictMode: false,
  
  // Disable image optimization for simpler deployment
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
