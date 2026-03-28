import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 Jahr — Shopify-Bilder ändern sich nicht (neue URL bei Änderung)
    deviceSizes: [390, 640, 828, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384, 512, 800],
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
