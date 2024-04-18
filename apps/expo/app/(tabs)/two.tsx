import { useState } from "react"
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native"
import { trpc } from "../../services/Query"

export default function TabTwoScreen() {
	const userMutation = trpc.users.createUser.useMutation()

	const [firstName, setFirstName] = useState("")

	const createUser = async () => {
		if (firstName.length === 0) {
			Alert.alert(
				"No First Name",
				"Please provide a first name for the new user",
				[{ text: "Okay" }]
			)
			return
		}
		await userMutation.mutateAsync({ name: firstName })
	}

	return (
		<View className="w-full h-full justify-center items-center">
			<TextInput
				className="w-4/6 h-12"
				value={firstName}
				placeholder="First Name"
				onChangeText={(text) => setFirstName(text)}
			/>
			<TextInput />
			<TouchableOpacity
				className="w-4/6 h-12 bg-blue-400"
				onPress={createUser}>
				<Text className="text-white">Create User</Text>
			</TouchableOpacity>
			{userMutation.error && (
				<Text>Error Occured {userMutation.error.message}</Text>
			)}
			{userMutation.data && (
				<Text>Error Occured {userMutation.data.name}</Text>
			)}
		</View>
	)
}
