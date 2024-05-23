// import { FileRouter } from "@monoexpo/server/uploadthing"
// import type { UploadthingComponentProps } from "@uploadthing/react"
// import { generateReactHelpers } from "@uploadthing/react"
// import { ImagePickerAsset } from "expo-image-picker"
// import url from "./url"

// export default function useImageUpload<
// 	TRouter extends FileRouter,
// 	TEndpoint extends keyof TRouter,
// 	TSkipPolling extends boolean = false,
// >(
// 	// @ts-ignore
// 	opts: UploadthingComponentProps<TRouter, TEndpoint, TSkipPolling>
// ) {
// 	const $opts = { ...opts, url }

// 	const { useUploadThing } = generateReactHelpers($opts)
// 	const uploadthing = useUploadThing($opts.endpoint as string, $opts)

// 	// const generateFileTypes = (
// 	// 	config: ExpandedRouteConfig | undefined
// 	// ): { allowedTypes: MediaTypeOptions; multiple: boolean } => {
// 	// 	const { fileTypes, multiple } = generatePermittedFileTypes(config)

// 	// 	// Forward mime-types from route config
// 	// 	const images = fileTypes.includes("image")
// 	// 	const videos = fileTypes.includes("video")

// 	// 	return {
// 	// 		allowedTypes:
// 	// 			images && videos
// 	// 				? MediaTypeOptions.All
// 	// 				: images
// 	// 					? MediaTypeOptions.Images
// 	// 					: MediaTypeOptions.Videos,
// 	// 		multiple,
// 	// 	}
// 	// }

// 	const processAndUpload = async (assets: ImagePickerAsset[]) => {
// 		const files = await Promise.all(
// 			assets.map(async (a) => {
// 				const blob = await fetch(a.uri).then((r) => r.blob())
// 				const n =
// 					a.fileName ?? a.uri.split("/").pop() ?? "unknown-filename"
// 				const file = new File([blob], n, {
// 					type: a.mimeType ?? "application/octet-stream",
// 				})
// 				const RNFormDataCompatibleFile = Object.assign(file, {
// 					uri: a.uri,
// 				})
// 				return RNFormDataCompatibleFile
// 			})
// 		)

// 		// use upload thing hook to start the upload

// 		uploadthing.startUpload(
// 			files as unknown as File[],
// 			"input" in $opts ? $opts.input : undefined
// 		)
// 	}
// 	// const { allowedTypes, multiple } = generateFileTypes(
// 	// 	uploadthing.permittedFileInfo?.config
// 	// )

// 	return {
// 		// allowedTypes,
// 		// multiple,
// 		processAndUpload,
// 	}
// }
