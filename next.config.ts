import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from common external sources used in the app.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
