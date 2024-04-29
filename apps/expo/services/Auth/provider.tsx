import { ClerkProvider } from "@clerk/clerk-expo"
import { TokenCache } from "@clerk/clerk-expo/dist/cache"
import * as SecureStore from "expo-secure-store"
import { ReactNode } from "react"
import { env } from "../../utils/env"

const tokenCache: TokenCache = {
	async getToken(key: string) {
		try {
			const token = await SecureStore.getItemAsync(key)
			console.log("found token " + token)
			return token
		} catch (err) {
			console.log(err)
			return null
		}
	},
	async saveToken(key: string, value: string) {
		try {
			console.log("setting token " + value)
			return await SecureStore.setItemAsync(key, value)
		} catch (err) {
			console.log(err)
			return
		}
	},
}

export default function AuthProvider({ children }: { children: ReactNode }) {
	return (
		<ClerkProvider
			tokenCache={tokenCache}
			publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string}>
			{children}
		</ClerkProvider>
	)
}
