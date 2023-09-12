/** @type {import('next').NextConfig} */
const nextConfig = {
    // phải config như này thì mới chấp nhận các link ảnh được
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',

            },
        ],
    },
}

module.exports = nextConfig
