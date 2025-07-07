import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: ['http://192.168.0.106'],
  },
} as NextConfig;

export default nextConfig;
