import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'imgs.search.brave.com',
      'ibb.co',
      'i.ibb.co',
      'drive.google.com',
      'res.cloudinary.com' 
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", 
      },
    ],
  },
};

export default nextConfig;
