/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
    ],
  },
  trailingSlash: true, // Re-enable trailing slash as per spec
  // Redirect old state routes to new format
  async redirects() {
    return [
      // Redirect /georgia to /georgia-network-cabling, etc.
      // This is handled by the [state]/page.tsx redirect component
    ];
  },
  // Ensure proper route matching for dynamic routes with suffixes
  async rewrites() {
    return [];
  },
}

module.exports = nextConfig
