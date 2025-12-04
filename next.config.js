/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
