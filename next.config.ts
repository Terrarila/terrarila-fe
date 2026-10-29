import type { NextConfig } from "next";

const config: NextConfig = {
  async rewrites() {
    const origin = (
      process.env.TERRALA_ASSET_URL ||
      process.env.TERRALA_API_URL ||
      "http://127.0.0.1:4000"
    ).replace(/\/$/, "");
    const url = new URL(origin);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    )
      throw new Error("TERRALA_ASSET_URL must be an HTTP(S) origin");
    return [
      { source: "/assets/:path*", destination: `${origin}/assets/:path*` },
    ];
  },
  turbopack: { root: process.cwd() },
  // Keep production verification separate from the running dev server.
  distDir: process.env.TERRALA_BUILD_DIR || ".next",
};

export default config;
