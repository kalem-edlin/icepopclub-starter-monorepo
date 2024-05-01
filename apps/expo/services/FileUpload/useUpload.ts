import {
	getUploadLimitsPerAcceptedMimeType,
	type Model,
} from "@monoexpo/server/shared"
import { DocumentPickerAsset } from "expo-document-picker"
import { ImagePickerAsset } from "expo-image-picker"
import { useState } from "react"
import { Alert } from "react-native"
import bytesToMegabytes from "../../utils/bToMb"
import { trpc } from "../Query"

type ErrorTypes = "SIZE_LIMIT_EXCEEDED" | "FILE_TYPE_NOT_SUPPORTED"

/**
 * Specific Error class for file upload error handling
 * @params message, code, fileUri - informs the front end of how to let the user know the file upload failed
 */
class FileProcessingError extends Error {
	code: ErrorTypes

	constructor(message: string, code: ErrorTypes, fileUri: string) {
		super(message)
		this.code = code
		Object.setPrototypeOf(this, FileProcessingError.prototype)
	}
}

export const useUpload = (
	onUploadComplete: (assets: Model.InsertFileBody[]) => Promise<void>
) => {
	const [processedFiles, setProcessedFiles] = useState<
		Map<
			string,
			{
				name: string
				file?: File
				processingError?: FileProcessingError
			}
		>
	>(new Map())
	const [isUploading, setIsUploading] = useState(false)

	const s3UploadErrorMutation = trpc.files.reportS3UploadFailure.useMutation()

	/**
	 * Presign mutation will upload files to S3 on completion or alert client of any backend signing errors
	 * Will Alert user as graceful handling happens on front end validation and all errors are unexpected
	 *
	 * Await oncomplete promise defined in parent for accurate isUploading flag
	 */
	const presignMutation = trpc.files.getFileUploadPresignedUrls.useMutation({
		onError: (e) => {
			Alert.alert(e.message)
			setIsUploading(false)
		},
		onSuccess: async (presignedFiles) => {
			const uploadedFileResponsePromise = presignedFiles.map(
				async (pf): Promise<Model.InsertFileBody> => {
					const asset = processedFiles.get(pf.localUri)
					if (!asset) {
						throw new Error(
							`Unexpectedly missing a record with local Uri ${pf.localUri}`
						)
					}
					if (!asset.file) {
						throw new Error(
							`Unexpectedly missing a processed file with local Uri ${pf.localUri}`
						)
					}
					const result = await fetch(pf.uploadUrl, {
						method: "PUT",
						body: asset.file,
						headers: {
							"Content-Type": asset.file!.type,
						},
					})
					if (!result.ok) {
						s3UploadErrorMutation.mutate({
							fileKey: pf.Key,
							fileSize: asset.file.size,
							fileType: asset.file.type,
						})
						throw new Error(
							`Unexpectedly encountered an S3 upload error`
						)
					}
					return {
						s3Key: pf.Key,
						mimeType: asset.file.type,
						mbSize: asset.file.size,
						name: asset.file.name,
					}
				}
			)
			await onUploadComplete(
				await Promise.all(uploadedFileResponsePromise)
			)
			setIsUploading(false)
		},
	})

	/**
	 * Process a batch of assets given a react native picker type
	 * @param assets
	 * @returns map of processed items with uri key. Informs client of processing errors per file
	 */
	const processBatch = (
		assets: ImagePickerAsset[] | DocumentPickerAsset[]
	) => {
		if (isUploading) {
			Alert.alert("Cannot add files while uploading")
			return
		}

		// Filter out failed processed files on batch update
		const filteredProcessedFiles = new Map(processedFiles)
		processedFiles.forEach((p, key) => {
			if (!p.processingError && p.file) {
				filteredProcessedFiles.set(key, p)
			}
		})
		setProcessedFiles(filteredProcessedFiles)

		// Process and add processed update batch to map
		assets.forEach(async (a) => {
			try {
				const name =
					(a as ImagePickerAsset).fileName ??
					(a as DocumentPickerAsset).name ??
					a.uri.split("/").pop() ??
					"unknown-filename"
				filteredProcessedFiles.set(a.uri, {
					name,
				})
				setProcessedFiles(new Map(filteredProcessedFiles))
				const blob = await fetch(a.uri).then((r) => r.blob())
				const file = new File([blob], name, {
					type: a.mimeType ?? "application/octet-stream",
				})
				const RNFormDataCompatibleFile = Object.assign(file, {
					uri: a.uri,
				})

				// On limit requirement breach, attach specific Errors to processed file records
				const limits = getUploadLimitsPerAcceptedMimeType(file.type)
				let error
				if (!limits) {
					error = new FileProcessingError(
						`File Type ${file.type} for ${file.name} is not supported`,
						"FILE_TYPE_NOT_SUPPORTED",
						a.uri
					)
				} else if (
					bytesToMegabytes(file.size) > limits.maxIndividualSizeMb
				) {
					error = new FileProcessingError(
						`File Size ${file.size} for ${file.name} is too large`,
						"SIZE_LIMIT_EXCEEDED",
						a.uri
					)
				}
				filteredProcessedFiles.set(a.uri, {
					name,
					file,
					processingError: error,
				})
				setProcessedFiles(new Map(filteredProcessedFiles))
			} catch (e) {
				// Unexpected Error
				Alert.alert(
					`File processing failed with unexpected error: ${e}`
				)
			}
		})
	}

	/**
	 * Filter out unprocessed files and call presign mutation
	 */
	const uploadProcessed = async () => {
		setIsUploading(true)

		// Filter out unprocessed files and call presign TRPC mutation
		presignMutation.mutate(
			Array.from(processedFiles)
				.filter(([key, p]) => !p.processingError && p.file)
				.map(([key, p]) => ({
					name: p.file!.name,
					type: p.file!.type,
					localUri: key,
				}))
		)
	}

	return {
		processedFiles,
		processBatch,
		uploadProcessed,
		isUploading,
	}
}
