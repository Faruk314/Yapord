import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    nodeMiddleware: true,
    useCache: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
    externalDir: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/yapord/**",
      },
    ],
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@shared": path.resolve(__dirname, "../shared"),
    };

    return config;
  },
};

export default nextConfig;
