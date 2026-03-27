import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "**.myshopify.com",
      },
      {
        protocol: "https",
        hostname: "mkdesignweb.de",
      },
      {
        protocol: "https",
        hostname: "judgeme-review-images.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.judge.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack(config, { isServer, dev }) {
    if (!isServer && !dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig;
