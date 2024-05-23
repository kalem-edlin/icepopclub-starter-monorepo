import { getDocumentAsync } from "expo-document-picker"
import { launchImageLibraryAsync } from "expo-image-picker"
import { router } from "expo-router"
import React from "react"
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { useUpload } from "../../../services/File/useUpload"
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

	const { isUploading, processBatch, processedFiles, uploadProcessedFiles } =
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

	return isUploading ? (
		<View className="h-full w-full justify-center items-center">
			<ActivityIndicator />
		</View>
	) : (
		<View className="w-full h-full items-center">
			<FlatList
				className="w-11/12 h-full "
				data={Array.from(processedFiles)}
				renderItem={({ item, index }) => {
					const [_, value] = item
					return (
						<View className="border-b border-b-gray-400 py-4 flex-row">
							<Text className="font-bold mr-1">{index}.</Text>
							<Text className="flex-grow text-left">
								{value.name.slice(0, 12)}
							</Text>
							{value.file && (
								<Text className="text-left mr-2">
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

			<View
				style={{ bottom: 32 }}
				className="absolute gap-y-4 w-full px-4 items-center justify-center">
				<View className="w-full justify-evenly flex-row">
					<TouchableOpacity
						onPress={handleUploadImage}
						className="py-3 mr-1 rounded-xl border flex-grow items-center justify-center">
						<Text className="font-semibold">Add Image</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleUploadFile}
						className="py-3 ml-1 rounded-xl border flex-grow items-center justify-center">
						<Text className="font-semibold">Add Document</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity
					onPress={uploadProcessedFiles}
					className="bg-cyan-500 w-full rounded-xl py-4 items-center">
					<Text className="text-white font-semibold">Upload</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
