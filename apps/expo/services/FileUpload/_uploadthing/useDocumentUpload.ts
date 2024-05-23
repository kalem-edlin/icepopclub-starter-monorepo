// import type { UploadthingComponentProps } from "@uploadthing/react"
// import { generateReactHelpers } from "@uploadthing/react"
// import type { DocumentPickerAsset } from "expo-document-picker"

// import { FileRouter } from "@acme/server/uploadthing"
// import url from "./url"

// export default function useDocumentUpload<
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

// 	// const generateFileTypes = () => {
// 	// 	const { fileTypes, multiple } = generatePermittedFileTypes(uploadthing.permittedFileInfo?.config)

// 	// 	// Forward mime-types from route config
// 	// 	const allowedMimeTypes: string[] = fileTypes

// 	// 	// Handle special UploadThing types
// 	// 	if (fileTypes.includes("image")) allowedMimeTypes.push("image/*")
// 	// 	if (fileTypes.includes("video")) allowedMimeTypes.push("video/*")
// 	// 	if (fileTypes.includes("audio")) allowedMimeTypes.push("audio/*")
// 	// 	if (fileTypes.includes("pdf")) allowedMimeTypes.push("application/pdf")
// 	// 	if (fileTypes.includes("text")) allowedMimeTypes.push("text/*")

// 	// 	if (fileTypes.includes("blob")) {
// 	// 		allowedMimeTypes.push("&ast;/*")
// 	// 		allowedMimeTypes.push("*/*")
// 	// 	}

// 	// 	return { mimeTypes: allowedMimeTypes, multiple }
// 	// }

// 	const processAndUpload = async (assets: DocumentPickerAsset[]) => {
// 		const files = await Promise.all(
// 			assets.map(async (a) => {
// 				const blob = await fetch(a.uri).then((r) => r.blob())
// 				const n = a.name ?? a.uri.split("/").pop() ?? "unknown-filename"
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

// 	// const { mimeTypes, multiple } = generateFileTypes(

// 	// )

// 	return {
// 		processAndUpload,
// 		// mimeTypes,
// 		// multiple,
// 	}
// }
