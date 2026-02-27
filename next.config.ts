import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://abulhbcdlpdnicszsgzs.supabase.co/**")],
  },
};

export default nextConfig;
