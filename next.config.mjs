import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  images: {
    loader: 'custom',
    loaderFile: './lib/cloudinary.ts',
  },

  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/blaze.html', destination: '/blaze', permanent: true },
      { source: '/kolasi.html', destination: '/kolasi', permanent: true },
      { source: '/about.html', destination: '/about', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/quote.html', destination: '/quote', permanent: true },
      { source: '/:path*.html', destination: '/:path*', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/((?!admin).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
