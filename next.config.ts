import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: { root: process.cwd() },
  // Keep production verification separate from the running dev server.
  distDir: process.env.TERRALA_BUILD_DIR || ".next",
};

export default config;
