/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent double renders in dev
  swcMinify: true,
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize webpack for development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      // Reduce the size of the webpack runtime
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a separate chunk for react/react-dom
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 20,
          },
          // Create a chunk for other vendor modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
