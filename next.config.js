/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'none';
    img-src 'self' blob: data:;
    connect-src 'self';
    font-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' https://cdn.tailwindcss.com/ 'unsafe-inline';
    frame-ancestors 'self';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
`

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
