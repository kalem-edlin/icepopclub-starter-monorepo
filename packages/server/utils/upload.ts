// TODO: Configure upload thing for expo when it is released

// export {
// 	createRouteHandler,
// 	createUploadthing,
// 	type FileRouter,
// } from "uploadthing/server"

// export { generatePermittedFileTypes } from "@uploadthing/shared"
// export type { ExpandedRouteConfig } from "@uploadthing/shared"

import { env } from "@monoexpo/env/server"
import S3 from "aws-sdk/clients/s3"
import { v4 as uuidv4 } from "uuid"
import z from "zod"

export const acceptedDocumentTypesRegex: RegExp = /^(image|video|audio|pdf)/
export const acceptedImageTypesRegex: RegExp = /^(image|video)/

export const zFileDetails = z.object({
	name: z.string(),
	type: z.string(),
	index: z.number(),
})

export const bucketName: string = env.S3_BUCKET_NAME

export const s3 = new S3({
	apiVersion: "2006-03-01",
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY,
		secretAccessKey: env.S3_SECRET_KEY,
	},
	region: env.S3_REGION,
	signatureVersion: "v4",
})

export const getPresignedUrl = async (file: z.infer<typeof zFileDetails>) => {
	const fileExtension = file.type.split("/")[1]
	if (!fileExtension) {
		throw new Error(`File Type not parsable ${file.type}`)
	}

	const Key = `${file.name}-${uuidv4()}.${file.type.split}`
	const s3Params = {
		Bucket: bucketName,
		Key,
		Expires: 60,
		ContentType: file.type,
	}

	const uploadUrl = await s3.getSignedUrl("putObject", s3Params)

	return {
		Key,
		uploadUrl,
		index: file.index,
	}
}
