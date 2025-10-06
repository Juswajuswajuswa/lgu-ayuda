/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/lrigu76hy/**", // This allows any path under your specific ImageKit ID
      },
    ],
  },
};

module.exports = nextConfig;
