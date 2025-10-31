/** @type {import('next').NextConfig} */

import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
};

export default nextConfig;
