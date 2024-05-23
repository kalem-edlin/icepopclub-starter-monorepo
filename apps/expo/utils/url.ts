import { env } from "@monoexpo/env/client"
import Constants from "expo-constants"

/**
 * Utility function to generate URL from current environment given a route
 * @param route
 * @returns url
 */
export function getHostUrl(route?: string) {
	let url: URL
	const debugUrl = Constants.expoConfig?.hostUri
	try {
		url = new URL(
			route ?? "",
			debugUrl ? `http://${debugUrl}` : env.EXPO_PUBLIC_SERVER_ORIGIN
		)
		console.log("resolved url", url)
		return url
	} catch (e) {
		throw new Error(
			`Failed to resolve URL from ${debugUrl ?? env.EXPO_PUBLIC_SERVER_ORIGIN} at route ${route}`
		)
	}
}

/**
 * Utility function to generate S3 Bucket URL given an object key
 * @param key
 * @returns url
 */
export function getS3Url(key: string) {
	let url: URL
	try {
		url = new URL(key, env.EXPO_PUBLIC_S3_URL_BASE)
		return url
	} catch (e) {
		throw new Error(
			`Failed to resolve URL from ${env.EXPO_PUBLIC_S3_URL_BASE} for key ${key}`
		)
	}
}
