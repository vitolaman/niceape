import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', // 👈 required for Cloudflare Pages with next-on-pages
  trailingSlash: true, // optional but recommended for static exports
};

export default nextConfig;
