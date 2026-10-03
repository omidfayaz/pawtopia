/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = (process.env.BACKEND_API_URL || "http://localhost:5232").replace(/\/$/, "");
    return [{ source: "/clinic-api/:path*", destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
