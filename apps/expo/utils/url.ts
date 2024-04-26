import Constants from "expo-constants"

export default function getUrl(route?: string) {
	let url: URL
	const debugUrl = Constants.expoConfig?.hostUri
	try {
		url = new URL(
			route ?? "",
			debugUrl
				? `http://${debugUrl}`
				: process.env.EXPO_PUBLIC_SERVER_ORIGIN
		)
		console.log("resolved url", url)
		return url
	} catch (e) {
		throw new Error(
			`Failed to resolve URL from ${debugUrl ?? process.env.EXPO_PUBLIC_SERVER_ORIGIN} at route ${route}`
		)
	}
}
