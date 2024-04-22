import { useAuth, useSignIn } from "@clerk/clerk-expo"
import { Stack, router } from "expo-router"
import React, { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import BackChevron from "../../components/Icons/BackChevron"

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [code, setCode] = useState("")
	const [successfulCreation, setSuccessfulCreation] = useState(false)
	const [secondFactor, setSecondFactor] = useState(false)
	const [error, setError] = useState("")

	const { isSignedIn } = useAuth()
	const { isLoaded, signIn, setActive } = useSignIn()

	if (!isLoaded) {
		return null
	}

	// If the user is already signed in,
	// redirect them to the home page
	if (isSignedIn) {
		router.replace("/(tabs)/")
	}

	// Send the password reset code to the user's email
	async function createResetCode() {
		await signIn
			?.create({
				strategy: "reset_password_email_code",
				identifier: email,
			})
			.then((_) => {
				setSuccessfulCreation(true)
				setError("")
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage)
				setError(err.errors[0].longMessage)
			})
	}

	// Reset the user's password.
	// Upon successful reset, the user will be
	// signed in and redirected to the home page
	async function handleReset() {
		await signIn
			?.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password,
			})
			.then((result) => {
				// Check if 2FA is required
				if (result.status === "needs_second_factor") {
					setSecondFactor(true)
					setError("")
				} else if (result.status === "complete") {
					// Set the active session to
					// the newly created session (user is now signed in)
					setActive({ session: result.createdSessionId })
					setError("")
				} else {
					console.log(result)
				}
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage)
				setError(err.errors[0].longMessage)
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
				onPress={createResetCode}>
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
						onPress={handleReset}>
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
