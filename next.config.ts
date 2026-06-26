import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        // Users paste arbitrary image URLs when creating recipes, so we allow
        // any HTTPS hostname. Wildcard `**` matches all hostnames via picomatch.
        //
        // port:     omitted → wildcard `**` implied (allow any port)
        // pathname: omitted → wildcard `**` implied (allow any path)
        // search:   omitted → wildcard `**` implied (allow any query string).
        //            In Next.js 16, `search: ""` means "no query string allowed",
        //            which would reject URLs like Unsplash's ?w=&q=&auto=&fit=.
      },
    ],
    // Users may request quality=80; v16 defaults qualities to [75], which
    // would coerce 80 → 75. Including 80 allows it to pass through as-is.
    qualities: [75, 80],
  },
};

export default nextConfig;
