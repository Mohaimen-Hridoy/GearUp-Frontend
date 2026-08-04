/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "@tanstack/react-query", "date-fns"],
  },
  images: {
    // Providers can paste any image URL for cover/gallery photos (see
    // gear-form.tsx), so we can't hard-code an allowlist of hostnames —
    // otherwise next/image throws at runtime for anything outside Unsplash.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
