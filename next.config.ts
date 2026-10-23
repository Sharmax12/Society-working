import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    const commonHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      {
        // Keep report-only until the deployed app has been tested for required
        // scripts, image hosts, OAuth redirects, and inline styles.
        key: "Content-Security-Policy-Report-Only",
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; object-src 'none'; base-uri 'self'; form-action 'self' https:; frame-ancestors 'none'",
      },
    ];

    return [
      { source: "/:path*", headers: commonHeaders },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" }],
      },
      {
        source: "/dashboard/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" }],
      },
      {
        source: "/apply/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" }],
      },
      {
        source: "/auth/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" }],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" },
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      {
        source: "/Connect",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet" }],
      },
    ];
  },
};
export default nextConfig;
