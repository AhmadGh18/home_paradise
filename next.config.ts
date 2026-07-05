import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Only allow the hosts we actually load remote images from. Admin-uploaded
    // images are stored as inline data: URLs and don't go through this list.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
