import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    // @ts-expect-error - Next.js warns to add allowedDevOrigins for cross-origin local requests
    allowedDevOrigins: [
      /* "192.168.1.2", */
      "192.168.1.33",
      "localhost",
      "127.0.0.1",
    ],
  },
  turbopack: {},
};

export default withPWA(nextConfig);
