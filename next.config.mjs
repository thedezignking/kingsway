/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14's parallel page collector intermittently loses generated route modules on Windows.
  // A single build worker is slower but deterministic; this does not affect the deployed runtime.
  experimental: { cpus: 1 },
};

export default nextConfig;
