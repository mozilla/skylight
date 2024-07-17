/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

const cspHeaderProd = `
    default-src 'none';
    img-src 'self' blob: data:;
    connect-src 'self';
    frame-src *;
    font-src 'self';
    script-src 'self';
    script-src-elem * 'unsafe-inline';
    style-src 'self';
    style-src-attr * 'unsafe-inline';
    frame-ancestors 'self';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
`;

const cspHeaderDev = `
    default-src 'none';
    img-src 'self' blob: data:;
    connect-src 'self';
    font-src 'self';
    script-src 'self' 'unsafe-eval';
    script-src-elem * 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    frame-ancestors 'self';
    base-uri 'self';
    form-action 'self';
    object-src 'none';
`;

const nextConfig = {
  staticPageGenerationTimeout: 120,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // {
          //   key: "Content-Security-Policy",
          //   value: isDev
          //     ? cspHeaderDev.replace(/\n/g, "")
          //     : cspHeaderProd.replace(/\n/g, ""),
          // },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              cspHeaderProd.replace(/\n/g, "") +
              "report-uri /csp-violation-report-endpoint/",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
