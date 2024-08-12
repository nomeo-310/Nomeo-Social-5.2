/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: '/hashtags/:tag',
        destination: '/search?query=%23:tag',
      },
    ];
  },
};

export default nextConfig;
