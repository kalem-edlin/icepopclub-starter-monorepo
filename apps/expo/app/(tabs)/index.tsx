import {
	ActivityIndicator,
	FlatList,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { useUserService } from "../../services/Auth/hooks/user"

// TODO: Is it okay to import types where the source defines its a type export instead of a type import for the sake of dependency population
import { getDocumentAsync } from "expo-document-picker"
import { launchImageLibraryAsync } from "expo-image-picker"
import { useState } from "react"
import { useDocumentUpload, useImageUpload } from "../../services/FileUpload"
import { trpc } from "../../services/Query"

export default function ProfileScreen() {
	const { isLoaded, isSignedIn, user } = useUserService()
	const userFiles = trpc.files.getUserFiles.useQuery(user.id)
	const postFiles = trpc.files.postFiles.useMutation()

	const [isFileUploading, setIsFileUploading] = useState(false)
	const [isImageUploading, setIsImageUploading] = useState(false)

	const documentUploader = useDocumentUpload({
		onUploadBegin: () => setIsFileUploading(true),
		onClientUploadComplete: (res) => {
			setIsFileUploading(false)
			postFiles.mutate(
				res.map((file) => ({
					mimeType: file.type,
					name: file.name,
					mbSize: file.size,
					url: file.url,
				}))
			)
		},
		endpoint: "document",
	})

	const imageUploader = useImageUpload({
		onUploadBegin: () => setIsFileUploading(true),
		onClientUploadComplete: (res) => {
			setIsFileUploading(false)
			postFiles.mutate(
				res.map((file) => ({
					mimeType: file.type,
					name: file.name,
					mbSize: file.size,
					url: file.url,
				}))
			)
		},
		endpoint: "videoAndImage",
	})

	const handleUploadFile = async () => {
		const result = await getDocumentAsync({
			multiple: documentUploader.multiple,
			type: documentUploader.mimeTypes,
		})

		if (!result.canceled) {
			documentUploader.processAndUpload(result.assets)
		}
	}

	const handleUploadImage = async () => {
		const result = await launchImageLibraryAsync({
			allowsMultipleSelection: imageUploader.multiple,
			mediaTypes: imageUploader.allowedTypes,
			quality: 0.2,
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
				{user.has_image && (
					<Image
						className="w-full h-28"
						source={{ uri: user.image_url! }}
					/>
				)}
				<Text>
					Name: {user.first_name} {user.last_name}
				</Text>
				<Text>Email: {user.primary_email_address_id}</Text>
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
				<View className="absolute bottom-6 w-full flex-row">
					<TouchableOpacity className="border-2">
						{isImageUploading ? (
							<ActivityIndicator />
						) : (
							<Text>Upload Image</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity className="border-2">
						{isFileUploading ? (
							<ActivityIndicator />
						) : (
							<Text>Upload File</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		)
	)
}
