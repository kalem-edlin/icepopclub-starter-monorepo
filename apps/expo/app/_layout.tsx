import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"

import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Platform } from "react-native"
import mixpanel from "../services/Analytics"
import { usePersistance } from "../services/Persistance"
import { QueryProvider } from "../services/Query/provider"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

import { NativeWindStyleSheet } from "nativewind"
import AuthProvider from "../services/User/provider"

NativeWindStyleSheet.setOutput({
	default: "native",
})

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	})

	console.log(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY)

	const userContext = usePersistance((state) => state.userContext)
	const setUserContext = usePersistance((state) => state.setUserContext)

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
			Platform.OS === "ios" && mixpanel?.track("App Launched")
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

	return Platform.OS !== "ios" ? (
		<Stack></Stack>
	) : (
		<AuthProvider>
			<QueryProvider>
				<Stack>
					<Stack.Screen
						name="(tabs)"
						options={{ headerShown: false }}
					/>
				</Stack>
			</QueryProvider>
		</AuthProvider>
	)
}
