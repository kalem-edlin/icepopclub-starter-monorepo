import { useUser } from "@clerk/clerk-expo"
import { AuthUser } from "@repo/server/db/types"

export const useUserService = () => {
	const { user } = useUser()
	const authUser = user as unknown as AuthUser

	if (!authUser)
		throw new Error("Auth User data inconsistent with metadata declaration")

	return { user: authUser }
}
