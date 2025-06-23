import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "www.gstatic.com",
      "imgs.search.brave.com",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },

  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default nextConfig;
