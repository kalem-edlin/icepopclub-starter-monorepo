import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import { trpc } from "../../services/Query"

export default function TabTwoScreen() {
	const users = trpc.pokes.getAllUsers.useQuery()
	const pokeUser = trpc.pokes.sendPoke.useMutation()

	return (
		<View className="h-full w-full justify-center items-center">
			{users.isLoading && <ActivityIndicator />}
			{users.data &&
				(users.data.length === 0 ? (
					<Text>No users found</Text>
				) : (
					users.data.map((user) => {
						return (
							<View
								key={user.data.id}
								className="flex-row w-full justify-between">
								<Text>
									{user.data.first_name}{" "}
									{user.data.last_name &&
										` ${user.data.last_name}`}
								</Text>
								<Text>pokes: {user.pokes}</Text>
								<TouchableOpacity
									onPress={() => {
										pokeUser.mutate({
											pokedUserId: user.data.id,
										})
									}}>
									<Text>
										{user.alreadyPoked ? "poked" : "poke"}
									</Text>
								</TouchableOpacity>
							</View>
						)
					})
				))}
			{users.error && <Text>Error Occured {users.error.message}</Text>}
		</View>
	)
}
