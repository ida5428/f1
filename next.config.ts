const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/f1/' : '',
  basePath: isProd ? '/f1' : '',
  output: 'export'
};

export default nextConfig;