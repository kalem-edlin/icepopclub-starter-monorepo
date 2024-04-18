import { ActivityIndicator, Text, View } from "react-native"
import { trpc } from "../../services/Query"

export default function TabOneScreen() {
	const userQuery = trpc.users.getAllUsers.useQuery()

	return (
		<View className="h-full w-full justify-center items-center">
			<Text>Tab One</Text>
			{userQuery.isLoading && <ActivityIndicator />}
			{userQuery.data &&
				(userQuery.data.length === 0 ? (
					<Text>No users yet</Text>
				) : (
					userQuery.data.map((user) => {
						return <Text>{user.name}</Text>
					})
				))}
			{userQuery.error && (
				<Text>Error Occured {userQuery.error.message}</Text>
			)}
		</View>
	)
}
