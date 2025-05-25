import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // Solo el hostname, no el puerto
        pathname: '/portadas/**',
      },
    ],
  },
};

export default nextConfig;
