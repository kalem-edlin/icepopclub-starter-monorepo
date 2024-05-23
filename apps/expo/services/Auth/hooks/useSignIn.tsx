import { useSignIn, useUser } from "@clerk/clerk-expo"

/**
 * React Hook using Clerk SDK to handle user Signin
 * Maintains necessary Clerk User data
 * @returns
 */
export const useSignInService = () => {
	const { signIn, setActive, isLoaded } = useSignIn()
	const { user } = useUser()

	/**
	 * Handle signin and update UI on callback given success
	 * @param identifier
	 * @param password
	 * @param callback
	 * @returns
	 */
	const onSignIn = async (
		identifier: string, // PRIMARY_USER_LOGIN
		password: string,
		callback: (errorMessage?: string) => void
	) => {
		try {
			if (!isLoaded) return
			const completeSignIn = await signIn.create({
				identifier: identifier,
				password,
			})
			await setActive({ session: completeSignIn.createdSessionId })
			callback()
		} catch (err: any) {
			console.log(err[0])
			callback((err as Error).message)
		}
	}

	return { onSignIn }
}
