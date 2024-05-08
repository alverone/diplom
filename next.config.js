/** @type {import('next').NextConfig} */
const nextConfig = {
  extends: ['plugin:@next/next/recommended'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
};

module.exports = nextConfig;
