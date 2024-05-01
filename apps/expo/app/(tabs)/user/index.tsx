import { ActivityIndicator, FlatList, Image, Text, View } from "react-native"

// TODO: Is it okay to import types where the source defines its a type export instead of a type import for the sake of dependency population
import { useUser } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { trpc } from "../../../services/Query"
import bytesToMegabytes from "../../../utils/bToMb"

export default function ProfileScreen() {
	const { isLoaded, isSignedIn, user } = useUser()

	if (!user) {
		return
	}

	const userFiles = trpc.files.getUserFiles.useQuery(user.id)

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
									{item.name} {item.mimeType}{" "}
									{item.mbSize &&
										bytesToMegabytes(item.mbSize)
											.toString()
											.slice(0, 4)}
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
					<Link href="/(tabs)/user/upload">Upload Files</Link>
				</View>
			</View>
		)
	)
}
