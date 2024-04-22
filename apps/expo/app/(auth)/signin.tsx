import { useSignIn } from "@clerk/clerk-expo"
import { Stack, router } from "expo-router"
import React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

export default function SignInScreen() {
	const { signIn, setActive, isLoaded } = useSignIn()
	const [emailAddress, setEmailAddress] = React.useState("")
	const [password, setPassword] = React.useState("")

	const onSignInPress = async () => {
		if (!isLoaded) {
			return
		}

		try {
			const completeSignIn = await signIn.create({
				identifier: emailAddress,
				password,
			})

			// This is an important step,
			// This indicates the user is signed in
			await setActive({ session: completeSignIn.createdSessionId })
			router.replace("/(tabs)/")
		} catch (err: any) {
			console.log(err)
		}
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
