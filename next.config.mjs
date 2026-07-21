import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const adminSecurityHeaders = [
      { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
      { key: "Content-Security-Policy", value: "base-uri 'self'; form-action 'self'; frame-ancestors 'none'" },
      { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
      { key: "Referrer-Policy", value: "no-referrer" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
    ];

    return [
      { source: "/login", headers: adminSecurityHeaders },
      { source: "/admin/:path*", headers: adminSecurityHeaders },
    ];
  },
  experimental: {
    cpus: 2,
    serverActions: {
      bodySizeLimit: "15mb"
    }
  },
  turbopack: {
    root: projectRoot
  }
};

export default nextConfig;
