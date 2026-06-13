/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    outputFileTracingIncludes: {
      '/api/extract-pdf': [
        './node_modules/pdf-parse/**/*', 
        '../../node_modules/pdf-parse/**/*',
        './node_modules/node-ensure/**/*',
        '../../node_modules/node-ensure/**/*'
      ],
    },
  },
  // Increase body size limit for API routes (default is ~4.5MB)
  // This is needed for base64-encoded resume files
  serverExternalPackages: ['mammoth', 'bluebird', '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner', 'pdf-parse'],
  transpilePackages: ['react-redux', 'recharts'],
};

export default nextConfig;
