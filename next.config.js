/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sumup.com",
              "frame-src https://*.sumup.com",
              "connect-src 'self' https://*.sumup.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sumup.com",
              "font-src 'self' https://fonts.gstatic.com https://*.sumup.com",
              "img-src 'self' data: blob: https://*.sumup.com",
              "worker-src blob: https://*.sumup.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
