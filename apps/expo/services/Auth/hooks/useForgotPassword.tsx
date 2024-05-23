import { useAuth, useSignIn } from "@clerk/clerk-expo"

// PRIMARY_USER_LOGIN

/**
 * React Hook to manage forgot password auth
 * Maintains Clerk user data and facilitates code authentication based password changing
 * @returns
 */
export const useForgotService = () => {
	const { isSignedIn } = useAuth()
	const { isLoaded, signIn, setActive } = useSignIn()

	/**
	 * Use Clerk SDK to send a password reset code to the user email
	 * @param identifier
	 * @param callback
	 */
	async function createResetCode(
		identifier: string,
		callback: (errorMessage?: string) => void
	) {
		try {
			await signIn?.create({
				strategy: "reset_password_email_code",
				identifier,
			})
			callback()
		} catch (err: any) {
			callback((err as Error).message)
		}
	}

	/**
	 * On code authentication, accept a new password for the Clerk user
	 * @param code
	 * @param newPassword
	 * @param callback
	 */
	async function handleReset(
		code: string,
		newPassword: string,
		callback: (errorMessage?: string | null) => void
	) {
		try {
			if (!isLoaded) return
			const completeForgotPassword = await signIn?.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password: newPassword,
			})
			await setActive({
				session: completeForgotPassword.createdSessionId,
			})
			callback()
		} catch (err: any) {
			callback((err as Error).message)
		}
	}

	return {
		isLoaded,
		isSignedIn,
		createResetCode,
		handleReset,
	}
}
