/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3', 'typeorm'],
  experimental: {},
};

export default nextConfig;
