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
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Setze den Source-Map-Typ auf 'source-map' anstelle von 'eval-source-map'
      config.devtool = 'source-map';
    }
    return config;
  },
};

export default nextConfig;
