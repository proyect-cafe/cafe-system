import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@cafe-system/types", "@cafe-system/ui", "@cafe-system/utils"],
};

export default nextConfig;
