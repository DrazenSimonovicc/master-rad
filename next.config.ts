const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8090",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
