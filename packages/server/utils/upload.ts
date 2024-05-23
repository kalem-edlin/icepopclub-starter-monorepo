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

export const acceptedFileTypesRegex: RegExp =
	/^(image\/|video\/|audio\/|application\/pdf$)/

export const zFileDetails = z.object({
	name: z.string(),
	type: z.string(),
	localUri: z.string(),
})

export type UploadLimits = {
	maxIndividualSizeMb: number
}

export const maxFilesPerUpload = 10

export const getUploadLimitsPerAcceptedMimeType = (
	type: string
): UploadLimits | undefined => {
	if (/^image\//.test(type)) {
		return {
			maxIndividualSizeMb: 10,
		}
	} else if (/^video\//.test(type)) {
		return {
			maxIndividualSizeMb: 20,
		}
	} else if (/^audio\//.test(type)) {
		return {
			maxIndividualSizeMb: 10,
		}
	} else if (/^application\/pdf$/.test(type)) {
		return {
			maxIndividualSizeMb: 15,
		}
	} else {
		console.log(`Checked Unsupported file type ${type}`)
		return
	}
}

export const bucketName: string = env.S3_BUCKET_NAME

/**
 * Initiate s3 instance given server environmental variables
 */
export const s3 = new S3({
	apiVersion: "2006-03-01",
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY,
		secretAccessKey: env.S3_SECRET_KEY,
	},
	region: env.S3_REGION,
	signatureVersion: "v4",
})

/**
 * Facilitate calls to AWS S3 to presign a file upload and return the upload URL and key to file upload route
 * Must be called before an update to database for file records
 * Front end must respond to result by uploading File via presigned URL if successful
 * @param file
 * @returns {S3ItemKey, S3UploadUrl, index} - index is to match file data to send
 */
export const getPresignedUrl = async (file: z.infer<typeof zFileDetails>) => {
	const fileExtension = file.type.split("/")[1]
	if (!fileExtension) {
		throw new Error(`File Type not parsable ${file.type}`)
	}

	const Key = `${file.name}-${uuidv4()}.${fileExtension}`
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
		localUri: file.localUri,
	}
}
