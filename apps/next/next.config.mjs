/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ["@acme/server", "@acme/env", "@acme/typescript"],
	distDir: "dist",
}

export default nextConfig
