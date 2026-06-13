/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Increase body size limit for API routes (default is ~4.5MB)
  // This is needed for base64-encoded resume files
  serverExternalPackages: ['mammoth', '@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner', 'pdf-parse'],
  transpilePackages: ['react-redux', 'recharts'],
};

export default nextConfig;
