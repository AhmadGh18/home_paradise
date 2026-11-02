import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Only allow the hosts we actually load remote images from. Keep this in
    // step with IMAGE_HOSTS in lib/validation.ts. Uploaded images are served
    // from /api/products/[id]/image/[version].
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          // A baseline only. Limiting scripts as well would need per-request nonces.
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self' mailto:",
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Keep the admin panel out of search results.
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Customer data and session state must never land in a shared cache.
      {
        source: '/api/(orders|auth)/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default nextConfig;
