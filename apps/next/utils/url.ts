import { env } from "@monoexpo/env/next"

/**
 * Utility function to generate URL from current environment given a route
 * @param route
 * @returns url
 */
export function getHostUrl(route?: string) {
	let url: URL
	if (typeof window !== "undefined") return "" // browser should use relative url
	if (env.NEXT_PUBLIC_SERVER_ORIGIN) return env.NEXT_PUBLIC_SERVER_ORIGIN // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}
