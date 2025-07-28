import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'imgs.search.brave.com',
      'ibb.co',
      'i.ibb.co',
      'drive.google.com',
      'res.cloudinary.com' // ✅ Add this line to support Google Drive images
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Gmail avatars
      },
    ],
  },
};

export default nextConfig;
