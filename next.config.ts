import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "pps.services.adobe.com",
      },
      {
        protocol: "https",
        hostname: "a5.behance.net",
      },
    ],
  },
}

export default nextConfig
