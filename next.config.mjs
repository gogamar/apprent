/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["cf.bstatic.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all subdomains
        pathname: "**", // Allow all paths
      },
    ],
  },
};

export default nextConfig;
