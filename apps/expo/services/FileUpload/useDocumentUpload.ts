import type { InsertFile } from "@monoexpo/server/model"
import type { DocumentPickerAsset } from "expo-document-picker"
import { useEffect, useState } from "react"
import { trpc } from "../Query"

export default function useDocumentUpload(
	onProcessingComplete: (error?: Error) => void,
	onUploadComplete: (assets: InsertFile[]) => void
) {
	const documentsPresigningMutation =
		trpc.files.getDocumentUploadPresignedUrls.useMutation()
	const [processedDocumentAssets, setProcessedDocumentAssets] = useState<
		undefined | { file: File & { uri: string }; index: number }[]
	>()

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

	useEffect(() => {
		if (documentsPresigningMutation.error) {
			console.error(
				`Presigning urls failed with: ${documentsPresigningMutation.error}`
			)
		}
	}, [documentsPresigningMutation.error])

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
