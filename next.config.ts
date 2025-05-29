import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090", // Ensure this matches the port in your image URL
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
