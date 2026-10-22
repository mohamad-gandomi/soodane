/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const landingDomain = (process.env.LANDING_DOMAIN || 'example.com').toLowerCase();
    const literalDomain = landingDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return {
      beforeFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: `(?:www\\.)?${literalDomain}` }],
          destination: '/landing',
        },
        {
          source: '/',
          has: [{ type: 'host', value: 'landing\\.localhost' }],
          destination: '/landing',
        },
        {
          source: '/',
          has: [{ type: 'query', key: '__domain', value: 'landing' }],
          destination: '/landing',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
