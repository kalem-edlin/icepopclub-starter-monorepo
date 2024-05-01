import { ActivityIndicator, FlatList, Image, Text, View } from "react-native"

// TODO: Is it okay to import types where the source defines its a type export instead of a type import for the sake of dependency population
import { useUser } from "@clerk/clerk-expo"
import { Link } from "expo-router"
import { trpc } from "../../../services/Query"

export default function ProfileScreen() {
	const { isLoaded, isSignedIn, user } = useUser()

	if (!user) {
		return
	}

	const userFiles = trpc.files.getUserFiles.useQuery()

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
						className="w-11/12 h-full "
						data={userFiles.data}
						renderItem={({ item, index }) => {
							return (
								<View className="border-b border-b-gray-400 py-4 flex-row">
									<Text className="font-bold mr-1">
										{index}.
									</Text>
									<Text className="flex-grow text-left">
										{item.name.slice(0, 12)}
									</Text>
									<Text className="flex-shrink text-left">
										{item.mbSize} mb
									</Text>
								</View>
							)
						}}
					/>
				)}
				{userFiles.isLoading && <ActivityIndicator />}
				{userFiles.error && (
					<Text>Error with {userFiles.error.message}</Text>
				)}

				<View
					style={{ bottom: 46 }}
					className="absolute py-4 bg-cyan-500 rounded-xl w-11/12 justify-evenly flex-row">
					<Link
						className="text-white font-semibold"
						href="/(tabs)/user/upload">
						Upload Files
					</Link>
				</View>
			</View>
		)
	)
}
