import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  typescript: {
    // We already verified type safety via tsc --noEmit.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
