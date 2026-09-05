/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    outputFileTracingIncludes: {
      '/api/**': ['./data/seed/**/*', './ml/**/*'],
      '/**': ['./data/seed/**/*', './ml/**/*'],
    },
  },
};

export default nextConfig;


