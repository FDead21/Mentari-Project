import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucvzwhmdqnshhhewbwmc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/gallery-images/**',
      },
      {
        protocol: 'https',
        hostname: 'ucvzwhmdqnshhhewbwmc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/location-images/**',
      },
      {
        protocol: 'https',
        hostname: 'ucvzwhmdqnshhhewbwmc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/activity-images/**',
      },
      {
        protocol: 'https',
        hostname: 'ucvzwhmdqnshhhewbwmc.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/site-assets/**',
      },
    ],
  },
};

module.exports = nextConfig;