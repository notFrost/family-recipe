import type { MetadataRoute } from "next";

/**
 * Web app manifest — PWA rung 1 (see MOBILE.md). Makes the site installable
 * ("Add to Home Screen") on Android and iOS with the amber identity. Icons
 * are generated at build time by app/icon.tsx / app/apple-icon.tsx via
 * ImageResponse — no raster assets checked in.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Family Recipe",
    short_name: "Family Recipe",
    description:
      "Store your family recipes, discover new ones, and keep your family's cooking together — even when you move out.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#d97706",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
