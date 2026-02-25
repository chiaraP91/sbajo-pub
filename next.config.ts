import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static HTML export for Firebase Hosting
  images: {
    unoptimized: true,
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
