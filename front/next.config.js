/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // FIXME: When real prod, please fix this
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;
