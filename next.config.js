/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (repo ? `/${repo}` : "");

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
