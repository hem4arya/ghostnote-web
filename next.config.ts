import type { NextConfig } from "next";
import path from "path";

const nextConfig = {
  /* config options here */
  experimental: {
    // allowedDevOrigins was removed as it's not a recognized option
  },
  webpack: (config: any) => {
    // Add alias for the packages using absolute paths
    config.resolve.alias = {
      ...config.resolve.alias,
      "@features/Navbar": path.resolve(__dirname, "packages/Navbar"),
      "@ghostnote/navbar": path.resolve(__dirname, "packages/Navbar"),
    };
    return config;
  },
} as NextConfig;

export default nextConfig;
