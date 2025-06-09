const {isServer} = require("@tanstack/react-query");
/** @type {import('next').NextConfig} */

const nextConfig = {
    swcMinify: false,
    output: 'standalone',
    reactStrictMode: false,
    transpilePackages: ['react-quill', 'quill'],
    experimental: {
        esmExternals: 'loose',
    },
    webpack: (config) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                os: false,
            };
        }

        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'kltn2025.s3.ap-southeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'medicaretechs3.s3.ap-southeast-2.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.nhathuoclongchau.com.vn',
                port: '',
                pathname: '/**',
            }
        ],
        unoptimized: false,
    },
};

module.exports = nextConfig;
