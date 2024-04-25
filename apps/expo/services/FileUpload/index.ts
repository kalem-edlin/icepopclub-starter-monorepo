const debuggerHost = Constants.expoConfig?.hostUri
let url: URL
try {
	url = new URL(
		initOpts?.url ?? "/api/uploadthing",
		process.env.EXPO_PUBLIC_SERVER_ORIGIN ?? `http://${debuggerHost}`
	)
	console.log("resolved url", url)
} catch (e) {
	throw new Error(
		`Failed to resolve URL from ${initOpts?.url?.toString()} and ${process.env.EXPO_PUBLIC_SERVER_ORIGIN} or ${debuggerHost}`
	)
}

export const vanillaHelpers = generateReactHelpers<TRouter>({
	...initOpts,
	url,
})
export const useImageUploader = useImageUploader<TRouter>({ url })

export const useDocumentUploader = useDocumentUploader<TRouter>({ url })
