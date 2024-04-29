import Constants from "expo-constants"
import { env } from "./env"

/**
 * Utility function to generate URL from current environment given a route
 * @param route
 * @returns
 */
export default function getUrl(route?: string) {
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
