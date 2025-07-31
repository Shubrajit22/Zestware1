import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'imgs.search.brave.com',
      'ibb.co',
      'i.ibb.co',
      'drive.google.com',
      'res.cloudinary.com',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com", // Gmail avatars
      },
    ],
  },
  webpack(config, _options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tailwindcss/postcss': resolve(__dirname, 'node_modules', 'tailwindcss'),
    };
    return config;
  },
};

export default nextConfig;
