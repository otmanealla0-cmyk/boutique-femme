/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        destination: '/api/apple-pay-domain',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https: data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "frame-src https:",
              "connect-src 'self' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "font-src 'self' data: https:",
              "img-src 'self' data: blob: https:",
              "worker-src blob: https:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
