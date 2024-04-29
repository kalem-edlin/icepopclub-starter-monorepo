import { useUser } from "@clerk/clerk-expo"
import { User } from "@monoexpo/server/model"

/**
 * React hook for parsing clerk user data into a database conistent User object
 * Functions as the opposite compliment to the server function server/utils/clerk parseUser
 * TODO: Will throw errors if required user data not found. Handle this more gracefully
 * @returns
 */
export const useUserService = () => {
	const { isLoaded, isSignedIn, user } = useUser()

	if (user && !user.primaryEmailAddress) {
		throw new Error("Auth User does not have primary user login (email)")
	}

	if (user && !user.createdAt) {
		throw new Error("Auth User does not have createdAt Date")
	}

	// PRIMARY_USER_LOGIN
	const authUser: User | undefined = user
		? {
				...user,
				createdAt: user.createdAt!,
				active: (user.unsafeMetadata["active"] as boolean) ?? true,
				emailAddress: user.primaryEmailAddress!.emailAddress,
			}
		: undefined

	if (!authUser)
		throw new Error("Auth User data inconsistent with metadata declaration")

	return { isLoaded, isSignedIn, authUser }
}
