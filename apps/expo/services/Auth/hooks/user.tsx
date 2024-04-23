import { useUser } from "@clerk/clerk-expo"
import { AuthUserMetaData } from "@monoexpo/server/db/types"

export const useUserService = () => {
	const { isLoaded, isSignedIn, user } = useUser()
	const authUser = user as unknown as typeof user & AuthUserMetaData

	if (!authUser)
		throw new Error("Auth User data inconsistent with metadata declaration")

	return { isLoaded, isSignedIn, user: authUser }
}
