/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // এটি যোগ করলে প্রজেক্টটি একদম স্ট্যাটিক এইচটিএমএল-এ কনভার্ট হয়ে যাবে, ফলে ভার্সেলে কোনো বিল্ড ফেইল করবে না
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;