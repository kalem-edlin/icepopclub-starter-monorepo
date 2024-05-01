import { getDocumentAsync } from "expo-document-picker"
import { launchImageLibraryAsync } from "expo-image-picker"
import { router } from "expo-router"
import React, { useEffect } from "react"
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { useUpload } from "../../../services/FileUpload/useUpload"
import { trpc } from "../../../services/Query"
import bytesToMegabytes from "../../../utils/bToMb"

export default function UploadFilesPage() {
	const postFiles = trpc.files.postFiles.useMutation({
		onSuccess: () => {
			router.back()
		},
		onError: (error) => {
			Alert.alert(error.message)
		},
	})

	const { isUploading, processBatch, processedFiles, uploadProcessed } =
		useUpload(async (assets) => {
			await postFiles.mutateAsync(assets)
		})

	const handleUploadFile = async () => {
		const result = await getDocumentAsync({
			// multiple: documentUploader.multiple,
			// type: documentUploader.mimeTypes,
		})

		if (!result.canceled) {
			processBatch(result.assets)
		}
	}

	const handleUploadImage = async () => {
		const result = await launchImageLibraryAsync({
			quality: 0.5,
			allowsMultipleSelection: true,
			// allowsMultipleSelection: imageUploader.multiple,
			// mediaTypes: imageUploader.allowedTypes,
			// quality: 0.2,
		})

		if (!result.canceled) {
			processBatch(result.assets)
		}
	}

	useEffect(() => {
		console.log(processedFiles)
	}, [processedFiles])

	return isUploading ? (
		<View className="h-full w-full justify-center items-center">
			<ActivityIndicator />
		</View>
	) : (
		<View className="w-full h-full">
			<FlatList
				className="w-full h-full"
				data={Array.from(processedFiles)}
				renderItem={({ item, index }) => {
					const [_, value] = item
					return (
						<View className="border-2 w-full py-4 flex-row">
							<Text className="font-bold">{index}.</Text>
							<Text className="flex-grow text-left">
								{value.name.slice(0, 12)}
							</Text>
							{value.file && (
								<Text className="flex-grow text-left">
									{bytesToMegabytes(value.file.size)
										.toString()
										.slice(0, 4)}
									mb
								</Text>
							)}
							<TouchableOpacity
								className="flex-shrink"
								onPress={() => {
									Alert.alert(
										value.processingError?.code ?? "Error",
										value.processingError?.message
									)
								}}
								disabled={!value.processingError}>
								<Text>
									{value.processingError ? "❌" : "✅"}
								</Text>
							</TouchableOpacity>
						</View>
					)
				}}
			/>

			<View style={{ bottom: 32 }} className="absolute border w-full">
				<View className="w-full justify-evenly flex-row">
					<TouchableOpacity
						onPress={handleUploadImage}
						className="py-2 border-2 flex-grow items-center justify-center">
						<Text>Add Image</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleUploadFile}
						className="py-2 border-2 flex-grow items-center justify-center">
						<Text>Add Document</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={uploadProcessed}
					className="py-4 w-full items-center">
					<Text>Upload</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
