/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	swcMinify: true,
	transpilePackages: [
		"@monoexpo/server",
		"@monoexpo/env",
		"@monoexpo/typescript",
	],
}

export default config
