/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all subdomains and paths over HTTPS
        pathname: "**",
      },
      {
        protocol: "http", // Allow HTTP for the specific domain
        hostname: "res.cloudinary.com", // Specify the domain without protocol
        pathname: "**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;
