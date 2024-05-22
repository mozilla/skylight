/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "Content-Security-Policy: default-src https: 'self' *.netlify.app; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob:; script-src https: 'self' 'unsafe-inline' 'unsafe-eval'; style-src https://cdn.tailwindcss.com/ https: 'self' 'unsafe-inline'; frame-ancestors 'self'",
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
