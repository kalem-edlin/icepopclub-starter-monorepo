import { Image, Text, View } from "react-native"
import { useUserService } from "../../services/Auth/hooks/user"

export default function ProfileScreen() {
	const { isLoaded, isSignedIn, user } = useUserService()

	return (
		isLoaded &&
		isSignedIn &&
		user && (
			<View className="w-full gap-y-3 h-full justify-center items-center">
				{user.hasImage && (
					<Image
						className="w-full h-28"
						source={{ uri: user.imageUrl }}
					/>
				)}
				<Text>Name: {user.fullName}</Text>
				<Text>Email: {user.primaryEmailAddress?.emailAddress},</Text>
			</View>
		)
	)
}
