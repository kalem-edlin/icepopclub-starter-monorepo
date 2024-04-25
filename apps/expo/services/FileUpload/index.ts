import type { UploadRouter } from "../../app/api/uploadthing+api"

import { generateReactHelpers } from "@uploadthing/react"

import url from "./url"
import useDocumentUpload from "./useDocumentUpload"
import useImageUpload from "./useImageUpload"

export { useDocumentUpload, useImageUpload }

// @ts-ignore
export const vanillaHelpers = generateReactHelpers<UploadRouter>({
	url,
})
