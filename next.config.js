/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'supabase.co'],
    unoptimized: true,
  },
}

module.exports = nextConfig
