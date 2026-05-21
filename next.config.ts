import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "app.revendamais.com.br",
      },
      {
        protocol: "https",
        hostname: "*.revendamais.com.br",
      },
    ],
  },
};

export default nextConfig;
