import { env } from "@monoexpo/env/expo"
import Constants from "expo-constants"

/**
 * Utility function to generate URL from current environment given a route
 * @param route
 * @returns url
 */
export function getHostUrl(route?: string) {
	let url: URL
	const localhost = Constants.expoConfig?.hostUri?.split(":")[0]

	if (!localhost)
		throw new Error("failed to get localhost, configure it manually")
	try {
		url = new URL(
			route ?? "",
			localhost
				? `http://${localhost}:3000`
				: env.EXPO_PUBLIC_SERVER_ORIGIN
		)
		console.log("resolved url", url)
		return url
	} catch (e) {
		throw new Error(
			`Failed to resolve URL from ${localhost ?? env.EXPO_PUBLIC_SERVER_ORIGIN} at route ${route}`
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
