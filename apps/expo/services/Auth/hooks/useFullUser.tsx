import { useUser } from "@clerk/clerk-expo"
import { Model } from "@monoexpo/server/shared"
import { router } from "expo-router"

/**
 * React hook for parsing clerk user data into a database conistent User object
 * Functions as the opposite compliment to the server function server/utils/clerk parseUser
 * TODO: Will throw errors if required user data not found. Handle this more gracefully
 * @returns
 */
export const useFullUser = () => {
	const { isLoaded, isSignedIn, user } = useUser()

	if (user && !user.primaryEmailAddress) {
		throw new Error("Auth User does not have primary user login (email)")
	}

	if (user && !user.firstName) {
		throw new Error("Auth User does not have primary user login (email)")
	}

	if (user && !user.createdAt) {
		throw new Error("Auth User does not have createdAt Date")
	}

	// PRIMARY_USER_LOGIN
	const authUser: Model.User | undefined = user
		? {
				...user,
				firstName: user.firstName!,
				lastName: user.lastName,
				createdAt: user.createdAt!,
				emailAddress: user.primaryEmailAddress!.emailAddress,
				authId: user.id,
				id: +user.externalId!,
				deactivatedAt: null,
			}
		: undefined

	if (!authUser) {
		router.replace("/(auth)/signin")
	}

	return { isLoaded, isSignedIn, user: authUser!, clerkUser: user }
}
