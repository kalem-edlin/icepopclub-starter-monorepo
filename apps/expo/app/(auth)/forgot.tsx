import { Stack, router } from "expo-router"
import React, { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import BackChevron from "../../components/Icons/BackChevron"
import { useForgotService } from "../../services/Auth/hooks/useForgotPassword"

export default function ForgotPasswordPage() {
	const { isLoaded, isSignedIn, createResetCode, handleReset } =
		useForgotService()

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [code, setCode] = useState("")
	const [successfulCreation, setSuccessfulCreation] = useState(false)
	const [error, setError] = useState("")

	if (!isLoaded) {
		return null
	}

	// If the user is already signed in,
	// redirect them to the home page
	if (isSignedIn) {
		router.replace("/(tabs)/user/")
	}

	async function onCreateResetCode() {
		await createResetCode(email, (errorMessage) => {
			if (errorMessage) {
				setError(errorMessage)
			} else {
				setSuccessfulCreation(true)
				setError("")
			}
		})
	}

	async function onHandleReset() {
		await handleReset(code, password, (errorMessage) => {
			setError(errorMessage ?? "")
		})
	}

	return (
		<View className="m-auto w-full">
			<Stack.Screen
				options={{
					headerShown: true,
					title: "Forgot Password",
					headerLeft: () => (
						<BackChevron
							color="black"
							onPress={() => router.back()}
						/>
					),
				}}
			/>
			<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto mb-4 ">
				<TextInput
					textContentType="emailAddress"
					placeholder="Email Address..."
					value={email}
					onChangeText={(emailAddress) => setEmail(emailAddress)}
				/>
			</View>

			<TouchableOpacity
				className="mt-4 w-3/5 bg-cyan-500 py-5 px-4 mx-auto rounded-xl"
				onPress={onCreateResetCode}>
				<Text className="text-center text-white font-semibold">
					Send password reset code
				</Text>
			</TouchableOpacity>
			{error && <Text>{error}</Text>}

			{successfulCreation && (
				<>
					<Text>Enter a new password</Text>
					<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto mb-4 ">
						<TextInput
							textContentType="password"
							placeholder="New Password..."
							value={password}
							onChangeText={(pass) => setPassword(pass)}
						/>
					</View>

					<Text>
						Enter the password reset code that was sent to your
						email
					</Text>
					<View className="px-4 py-3 border w-10/12 rounded-xl mx-auto mb-4 ">
						<TextInput
							textContentType="oneTimeCode"
							placeholder="Code..."
							value={code}
							onChangeText={(verificationCode) =>
								setCode(verificationCode)
							}
						/>
					</View>

					<TouchableOpacity
						className="mt-4 w-2/5 bg-cyan-500 py-5 mx-auto rounded-xl"
						onPress={onHandleReset}>
						<Text className="text-center text-white font-semibold">
							Reset
						</Text>
					</TouchableOpacity>
					{error && <Text>{error}</Text>}
				</>
			)}
		</View>
	)
}
