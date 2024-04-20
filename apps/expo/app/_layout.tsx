import { ClerkProvider } from "@clerk/clerk-expo"
import { TokenCache } from "@clerk/clerk-expo/dist/cache"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SecureStore from "expo-secure-store"
import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"
import { Platform } from "react-native"
import mixpanel from "../services/Analytics"
import { usePersistance } from "../services/Persistance"
import { QueryProvider } from "../services/Query/provider"

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

import { NativeWindStyleSheet } from "nativewind"

NativeWindStyleSheet.setOutput({
  default: "native",
});

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	})

    console.log(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY)


    const userContext = usePersistance(state => state.userContext)
    const setUserContext = usePersistance(state => state.setUserContext)

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
            Platform.OS === "ios" &&  mixpanel?.track("App Launched")
		}
	}, [loaded])

	if (!loaded) {
		return null
	}

    const tokenCache: TokenCache = {
        async getToken(key: string) {
            try {
              const token = await SecureStore.getItemAsync(key);
              console.log("found token " + token)
              return token
            } catch (err) {
                console.log(err)
              return null;
            }
          },
          async saveToken(key: string, value: string) {
            try {
              console.log("setting token " + value)
              return await SecureStore.setItemAsync(key, value);
            } catch (err) {
                console.log(err)
              return;
            }
          },
    }  

    return Platform.OS !== "ios" ? <Stack></Stack> : <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
    <QueryProvider>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
       
    </QueryProvider>
    </ClerkProvider>
}