import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
        // `search` intentionally omitted: in Next.js 16, `search: ""` means
        // "no query string allowed", which rejected Unsplash's ?w=&q=&auto=&fit= URLs.
        // Omitting it allows any query string.
      },
    ],
    // URLs request q=80; v16 defaults qualities to [75], which would coerce 80 -> 75.
    qualities: [75, 80],
  },
};

export default nextConfig;
