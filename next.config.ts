import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', 
      },
      { protocol: 'https', 
        hostname: 'substack-post-media.s3.amazonaws.com', 
        pathname: '/**' },
    ],
  },
  reactStrictMode: true, 
};

export default nextConfig;