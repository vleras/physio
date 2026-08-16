// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "*.supabase.co",
//         pathname: "/storage/v1/object/public/**",
//       },
//     ],
//     formats: ['image/avif', 'image/webp'],
//   },
//   // Optimize for production
//   compress: true,
//   poweredByHeader: false,
// };

// module.exports = nextConfig;
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
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
  async redirects() {
    return [
      { source: "/produktet", destination: "/products", permanent: true },
      { source: "/sherbimet", destination: "/services", permanent: true },
      { source: "/proizvodi", destination: "/products", permanent: true },
      { source: "/proizvod/:id", destination: "/product/:id", permanent: true },
      {
        source: "/:locale(en|mk|sq)/produktet",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/:locale(en|mk|sq)/sherbimet",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/:locale(en|mk|sq)/proizvodi",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/:locale(en|mk|sq)/proizvod/:id",
        destination: "/product/:id",
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
