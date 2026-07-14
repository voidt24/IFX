/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "hls.js": new URL("./node_modules/hls.js/dist/hls.min.js", import.meta.url).pathname,
    };
    return config;
  },
};

export default nextConfig;
