import { InsertFile } from "@monoexpo/server/model"
import { ImagePickerAsset } from "expo-image-picker"
import { useEffect, useState } from "react"
import { trpc } from "../Query"

/**
 * React Hook to maintain document data processing state,
 * Maintain and handle trpc server mutation state for image presigning
 * Facilitate S3 upload on completion
 * @param onProcessingComplete - when image data is processed into all necessary components for presigning and upload
 * @param onUploadComplete - when upload to S3 has completed and the assets with S3 key and name data
 * @returns
 */
export default function useImageUpload(
	onProcessingComplete: (error?: Error) => void,
	onUploadComplete: (assets: InsertFile[]) => void
) {
	const imagesPresigningMutation =
		trpc.files.getImageUploadPresignedUrls.useMutation()
	const [processedImageAssets, setProcessedImageAssets] = useState<
		undefined | { file: File & { uri: string }; index: number }[]
	>()

	/**
	 * Generate file data via blob data, alerting client of data processing complete
	 * Will Request presigned URLs via trpc - alerting client via TRPC mutation state
	 * @param assets
	 * @returns
	 */
	const processAndUpload = (assets: ImagePickerAsset[]) => {
		try {
			Promise.all(
				assets.map(async (a, index) => {
					const blob = await fetch(a.uri).then((r) => r.blob())
					const n =
						a.fileName ??
						a.uri.split("/").pop() ??
						"unknown-filename"
					const file = new File([blob], n, {
						type: a.mimeType ?? "application/octet-stream",
					})
					const RNFormDataCompatibleFile = Object.assign(file, {
						uri: a.uri,
					})
					// TODO: Frontend check on whether the file type/size is acceptable (error state returned in hook)

					return { file: RNFormDataCompatibleFile, index }
				})
			).then((pds) => {
				onProcessingComplete()
				setProcessedImageAssets(pds)
				imagesPresigningMutation.mutate(
					pds.map((d) => ({
						name: d.file.name,
						type: d.file.type,
						index: d.index,
					}))
				)
			})
		} catch (e) {
			onProcessingComplete(e as Error)
			return
		}
	}

	/**
	 * If there is a presign request error, log
	 * @param imagesPresigningMutation.error - error data set by presign mutation on failure
	 */
	useEffect(() => {
		if (imagesPresigningMutation.error) {
			console.error(
				`Presigning urls failed with: ${imagesPresigningMutation.error}`
			)
		}
	}, [imagesPresigningMutation.error])

	/**
	 * On presigning mutation completion handle upload to S3 via fetch using presigned URL and asset data state
	 * @param imagesPresigningMutation.data - Data returned from presign mutation
	 * @param processedImageAssets - hook maintained state of processed image assets
	 */
	useEffect(() => {
		if (imagesPresigningMutation.data && processedImageAssets) {
			const uploadImages = async () => {
				const uploadedImagesPromises =
					imagesPresigningMutation.data.map(
						async (pd): Promise<InsertFile> => {
							const asset = processedImageAssets[pd.index]
							await fetch(pd.uploadUrl, {
								method: "PUT",
								body: asset.file,
								headers: {
									"Content-Type": asset.file.type,
								},
							})
							return {
								s3Key: pd.Key,
								mimeType: asset.file.type,
								mbSize: asset.file.size,
								name: asset.file.name,
							}
						}
					)
				onUploadComplete(await Promise.all(uploadedImagesPromises))
			}
			uploadImages()
		}
	}, [imagesPresigningMutation.data, processedImageAssets])

	return {
		processAndUpload,
		isPending: imagesPresigningMutation.isPending,
	}
}
