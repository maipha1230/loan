import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  serverRuntimeConfig: {
    API_URL: process.env.NEXT_PUBLIC_API_URL
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET
  },
};

export default nextConfig;
