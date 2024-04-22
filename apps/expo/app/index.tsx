import * as Linking from "expo-linking"
import { Redirect, Stack } from "expo-router"
import { Image, Platform, Text, TouchableOpacity, View } from "react-native"

export default function Page() {
	return Platform.OS === "web" ? (
		<View className="w-full">
			<Stack.Screen options={{ headerShown: false }} />
			<View className="h-[100vh] w-5/6 mx-auto ">
				<View className="mt-4  h-24 flex-row items-center">
					<View className=" flex-grow h-3/4 flex-row justify-start ">
						<View className="h-full aspect-square">
							<Image
								className="w-full h-full"
								source={require("../assets/favicon.png")}
							/>
						</View>
					</View>
					<TouchableOpacity
						onPress={() =>
							Linking.openURL("mailto:kalemedlin@gmail.com")
						}>
						<Text className="text-lg mr-8 font-extralight text-cyan-400">
							Contact Us
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() =>
							Linking.openURL(
								"https://apps.apple.com/us/app/devotion-communities-christ/id6496435728"
							)
						}>
						<Text className="text-lg font-extralight text-cyan-400">
							Download
						</Text>
					</TouchableOpacity>
				</View>
				<View className="items-center justify-center w-1/3 mx-auto mt-36">
					<Text className="text-[70px] text-center mb-6 font-semibold">
						Monoexpo
					</Text>
					<Text className="text-lg font-extralight text-center mb-10 text-cyan-400 ">
						A boilerplate project for a Turbo monorepos that use
						expo router, trpc, Drizzle ORM for headless DB
						integration, and Clerk authentication
					</Text>
					<TouchableOpacity
						onPress={() =>
							Linking.openURL(
								"https://apps.apple.com/us/app/devotion-communities-christ/id6496435728"
							)
						}
						className="bg-cyan-400 rounded-md p-3">
						<Text className="text-lg font-light text-white">
							Get the App
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View className="justify-center items-center w-full h-36 bg-black opacity-90">
				<View className="flex-row gap-x-6 ">
					<Text
						onPress={() =>
							Linking.openURL("mailto:kalemedlin@gmail.com")
						}
						className="text-white opacity-50">
						Email
					</Text>
					<Text
						onPress={() =>
							Linking.openURL(
								"https://kalem-edlin.github.io/devotion-privacy/"
							)
						}
						className="text-white opacity-50">
						Privacy Policy
					</Text>
					<Text className="text-white opacity-50">
						@ Ice Pop Club
					</Text>
				</View>
			</View>
		</View>
	) : (
		<Redirect href={"/(tabs)/"} />
	)
}
