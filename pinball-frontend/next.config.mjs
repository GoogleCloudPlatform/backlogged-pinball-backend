/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;

