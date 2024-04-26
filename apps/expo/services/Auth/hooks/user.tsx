import { useUser } from "@clerk/clerk-expo"
import { User } from "@monoexpo/server/model"

export const useUserService = () => {
	const { isLoaded, isSignedIn, user } = useUser()
	const authUser = user as unknown as User

	if (!authUser)
		throw new Error("Auth User data inconsistent with metadata declaration")

	return { isLoaded, isSignedIn, user: authUser }
}
