import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://assets.calendly.com https://cdn.mux.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.calendly.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://image.mux.com https://www.facebook.com",
              "media-src 'self' blob: https://stream.mux.com https://*.mux.com https://res.cloudinary.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://inferred.litix.io https://connect.facebook.net https://stream.mux.com https://*.mux.com https://cdn.mux.com",
              "frame-src https://calendly.com https://www.facebook.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig);
