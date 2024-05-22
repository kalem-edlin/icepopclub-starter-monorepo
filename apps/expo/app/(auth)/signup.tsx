import { Stack, router } from "expo-router"
import * as React from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import { useSignUpService } from "../../services/Auth/hooks/useSignUp"

export default function SignUpScreen() {
	const { onSignUp, onVerify } = useSignUpService()

	const [firstName, setFirstName] = React.useState("")
	const [lastName, setLastName] = React.useState("")
	const [emailAddress, setEmailAddress] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [pendingVerification, setPendingVerification] = React.useState(false)
	const [code, setCode] = React.useState("")

	// start the sign up process.
	const onSignUpPress = async () => {
		await onSignUp(
			emailAddress,
			password,
			() => setPendingVerification(true),
			{ firstName, lastName }
		)
	}

	const onPressVerify = async () => {
		await onVerify(code, () => router.replace("/(tabs)/user/"))
	}

	return (
		<View>
			<Stack.Screen options={{ headerShown: true, title: "Sign Up" }} />

			{!pendingVerification && (
				<View className="gap-y-4 mt-24">
					<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto ">
						<TextInput
							autoCapitalize="none"
							value={firstName}
							placeholder="First Name..."
							onChangeText={(firstName) =>
								setFirstName(firstName)
							}
						/>
					</View>
					<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto ">
						<TextInput
							autoCapitalize="none"
							value={lastName}
							placeholder="Last Name..."
							onChangeText={(lastName) => setLastName(lastName)}
						/>
					</View>
					<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto ">
						<TextInput
							autoCapitalize="none"
							value={emailAddress}
							placeholder="Email..."
							onChangeText={(email) => setEmailAddress(email)}
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
						className="w-2/5 bg-cyan-500 py-5 mx-auto rounded-xl"
						onPress={onSignUpPress}>
						<Text className="text-center text-white font-semibold">
							Sign up
						</Text>
					</TouchableOpacity>
				</View>
			)}
			{pendingVerification && (
				<View>
					<View className="mt-28 px-4 py-3 border w-10/12 rounded-xl mx-auto mb-4 ">
						<TextInput
							value={code}
							placeholder="Code..."
							onChangeText={(code) => setCode(code)}
						/>
					</View>
					<TouchableOpacity
						className="w-2/5 bg-cyan-500 py-5 mx-auto rounded-xl"
						onPress={onPressVerify}>
						<Text className="text-center text-white font-semibold">
							Verify Email
						</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	)
}
