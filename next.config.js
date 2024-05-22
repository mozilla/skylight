/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src https: 'self' *.netlify.app;
    font-src 'self';
    img-src 'self' blob: data:;
    script-src https: 'self' 'unsafe-inline' 'unsafe-eval';
    style-src https://cdn.tailwindcss.com/ https: 'self' 'unsafe-inline';
    frame-ancestors 'self';
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
