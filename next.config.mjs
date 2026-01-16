/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'bjsnoccotxcviuahthmz.supabase.co',
      },
    ],
  },
  // CRITICAL: Disable static optimization to prevent production caching issues
  // Pages with dynamic rendering flags will be rendered on-demand
  // This prevents stale UI and ensures fresh data on every request
};

export default nextConfig;
