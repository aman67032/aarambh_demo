// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/qrcode/**',
      },
    ],
  },
  reactStrictMode: true,
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    // Removed optimizePackageImports to fix deployment issues
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Video handling is now configured in vercel.json
  // Reduce bundle size
  webpack: (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;