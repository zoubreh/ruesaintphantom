/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/images/**' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
    ],
  },
  transpilePackages: ['next-sanity'],
};

export default nextConfig;
