import { Stack, router } from "expo-router"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSignInService } from "../../services/Auth/hooks/signIn"

export default function SignInScreen() {
	const { onSignIn } = useSignInService(() => router.replace("/(tabs)/user/"))
	const [emailAddress, setEmailAddress] = React.useState("")
	const [password, setPassword] = React.useState("")

	const onSignInPress = async () => {
		await onSignIn(emailAddress, password)
	}

	return (
		<View className="justify-center items-center">
			<Stack.Screen options={{ headerShown: true, title: "Sign In" }} />
			<View className="mt-28 px-4 py-3 border w-10/12 rounded-xl mx-auto mb-4 ">
				<TextInput
					autoCapitalize="none"
					value={emailAddress}
					placeholder="Email..."
					onChangeText={(emailAddress) =>
						setEmailAddress(emailAddress)
					}
				/>
			</View>

			<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto mb-4 ">
				<TextInput
					value={password}
					placeholder="Password..."
					secureTextEntry={true}
					onChangeText={(password) => setPassword(password)}
				/>
			</View>

			<TouchableOpacity
				className="mt-4 w-2/5 bg-cyan-500 py-5 mx-auto rounded-xl"
				onPress={onSignInPress}>
				<Text className="text-center text-white font-semibold">
					Sign in
				</Text>
			</TouchableOpacity>
			<Text
				onPress={() => router.push("/(auth)/forgot")}
				className="mt-8 text-center">
				Forgot Password?
			</Text>
			<Text
				className="mt-2"
				onPress={() => router.push("/(auth)/signup")}>
				Dont have an account? Sign up
			</Text>
		</View>
	)
}
