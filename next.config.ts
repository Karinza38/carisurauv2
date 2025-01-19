import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dcm2976bhgfsz.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "d252nd24znc5wy.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
