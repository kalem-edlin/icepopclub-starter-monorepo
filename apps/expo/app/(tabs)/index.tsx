import {
	ActivityIndicator,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native"

// TODO: Is it okay to import types where the source defines its a type export instead of a type import for the sake of dependency population
import { useUser } from "@clerk/clerk-expo"
import { getDocumentAsync } from "expo-document-picker"
import { launchImageLibraryAsync } from "expo-image-picker"
import { useState } from "react"
import { useDocumentUpload, useImageUpload } from "../../services/FileUpload"
import { trpc } from "../../services/Query"

export default function ProfileScreen() {
	const { isLoaded, isSignedIn, user } = useUser()

	if (!user) {
		return
	}

	const userFiles = trpc.files.getUserFiles.useQuery(user.id)
	const postFiles = trpc.files.postFiles.useMutation()

	const documentUploader = useDocumentUpload(
		(e) => {
			e
				? console.error(`processing failed with error: ${e.message}`)
				: console.log("processing complete")
		},
		(assets) => {
			postFiles.mutate(assets)
		}
	)

	const imageUploader = useImageUpload(
		(e) => {
			e
				? console.error(`processing failed with error: ${e.message}`)
				: console.log("processing complete")
		},
		(assets) => {
			console.log(`assets uploaded to s3 - adding file rows`)
			postFiles.mutate(assets)
		}
	)

	const [isFileUploading, setIsFileUploading] = useState(false)
	const [isImageUploading, setIsImageUploading] = useState(false)

	const handleUploadFile = async () => {
		const result = await getDocumentAsync({
			// multiple: documentUploader.multiple,
			// type: documentUploader.mimeTypes,
		})

		if (!result.canceled) {
			documentUploader.processAndUpload(result.assets)
		}
	}

	const handleUploadImage = async () => {
		const result = await launchImageLibraryAsync({
			// allowsMultipleSelection: imageUploader.multiple,
			// mediaTypes: imageUploader.allowedTypes,
			// quality: 0.2,
		})

		if (!result.canceled) {
			imageUploader.processAndUpload(result.assets)
		}
	}

	return (
		isLoaded &&
		isSignedIn &&
		user && (
			<View className="w-full gap-y-3 h-full mt-8 items-center">
				{user.imageUrl && (
					<Image
						className="w-full h-28"
						source={{ uri: user.imageUrl! }}
					/>
				)}
				<Text>
					Name: {user.firstName} {user.lastName}
				</Text>
				<Text>Email: {user.primaryEmailAddress?.emailAddress}</Text>
				{userFiles.data && (
					<FlatList
						data={userFiles.data}
						renderItem={({ item }) => {
							return (
								<Text>
									{item.name} {item.mimeType} {item.mbSize}
									mb
								</Text>
							)
						}}
					/>
				)}
				{userFiles.isLoading && <ActivityIndicator />}
				{userFiles.error && (
					<Text>Error with {userFiles.error.message}</Text>
				)}
				<View
					style={{ bottom: 32 }}
					className="absolute w-full justify-evenly flex-row">
					<TouchableOpacity
						onPress={handleUploadImage}
						className="py-2 border-2 flex-grow items-center justify-center">
						{imageUploader.isPending || postFiles.isPending ? (
							<ActivityIndicator />
						) : (
							<Text>Upload Image</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleUploadFile}
						className="py-2 border-2 flex-grow items-center justify-center">
						{documentUploader.isPending || postFiles.isPending ? (
							<ActivityIndicator />
						) : (
							<Text>Upload Document</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		)
	)
}
