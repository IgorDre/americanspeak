import type { NextConfig } from "next";

// next-pwa has no bundled TypeScript types; cast manually to avoid @types/next-pwa
const withPWA = require("next-pwa") as (pwaConfig: {
  dest: string;
  disable?: boolean;
  register?: boolean;
  skipWaiting?: boolean;
}) => (nextConfig: NextConfig) => NextConfig;

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})(nextConfig);
