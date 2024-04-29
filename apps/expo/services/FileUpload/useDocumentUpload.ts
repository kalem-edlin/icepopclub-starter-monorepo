import type { InsertFile } from "@monoexpo/server/model"
import type { DocumentPickerAsset } from "expo-document-picker"
import { useEffect, useState } from "react"
import { trpc } from "../Query"

/**
 * React Hook to maintain document data processing state,
 * Maintain and handle trpc server mutation state for document presigning
 * Facilitate S3 upload on completion
 * @param onProcessingComplete - when document data is processed into all necessary components for presigning and upload
 * @param onUploadComplete - when upload to S3 has completed and the assets with S3 key and name data
 * @returns
 */
export default function useDocumentUpload(
	onProcessingComplete: (error?: Error) => void,
	onUploadComplete: (assets: InsertFile[]) => void
) {
	const documentsPresigningMutation =
		trpc.files.getDocumentUploadPresignedUrls.useMutation()
	const [processedDocumentAssets, setProcessedDocumentAssets] = useState<
		undefined | { file: File & { uri: string }; index: number }[]
	>()

	/**
	 * Generate file data via blob data, alerting client of data processing complete
	 * Will Request presigned URLs via trpc - alerting client via TRPC mutation state
	 * @param assets
	 * @returns
	 */
	const processAndUpload = (assets: DocumentPickerAsset[]) => {
		try {
			Promise.all(
				assets.map(async (a, index) => {
					const blob = await fetch(a.uri).then((r) => r.blob())
					const n =
						a.name ?? a.uri.split("/").pop() ?? "unknown-filename"
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
				setProcessedDocumentAssets(pds)
				documentsPresigningMutation.mutate(
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
	 * @param documentsPresigningMutation.error - error data set by presign mutation on failure
	 */
	useEffect(() => {
		if (documentsPresigningMutation.error) {
			console.error(
				`Presigning urls failed with: ${documentsPresigningMutation.error}`
			)
		}
	}, [documentsPresigningMutation.error])

	/**
	 * On presigning mutation completion handle upload to S3 via fetch using presigned URL and asset data state
	 * @param documentsPresigningMutation.data - Data returned from presign mutation
	 * @param processedDocumentAssets - hook maintained state of processed document assets
	 */
	useEffect(() => {
		if (documentsPresigningMutation.data && processedDocumentAssets) {
			const uploadDocuments = async () => {
				const uploadedDocumentsPromises =
					documentsPresigningMutation.data.map(
						async (pd): Promise<InsertFile> => {
							const asset = processedDocumentAssets[pd.index]
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
				onUploadComplete(await Promise.all(uploadedDocumentsPromises))
			}
		}
	}, [documentsPresigningMutation.data, processedDocumentAssets])

	return {
		processAndUpload,
		isPending: documentsPresigningMutation.isPending,
	}
}
