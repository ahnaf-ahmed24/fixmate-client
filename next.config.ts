import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Dashboard pages are auth-gated Client Components: they can't export
    // `instant = false` themselves, and their session check blocks the static
    // shell by design. Validate only segments that explicitly opt in.
    instantInsights: {
      validationLevel: "manual-warning",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      // Avatars from social sign-in (Google / GitHub)
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      // Service photos & avatars uploaded through the server (ImgBB)
      { protocol: "https", hostname: "i.ibb.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
