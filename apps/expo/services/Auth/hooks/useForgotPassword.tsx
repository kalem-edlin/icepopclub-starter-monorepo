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
		await signIn
			?.create({
				strategy: "reset_password_email_code",
				identifier,
			})
			.then((_) => {
				callback()
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage)
				callback(err.errors[0].longMessage)
			})
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
		await signIn
			?.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password: newPassword,
			})
			.then((result) => {
				// Check if 2FA is required
				if (result.status === "complete") {
					setActive({ session: result.createdSessionId })
					callback()
				} else {
					callback(result.status)
				}
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage)
				callback(err.errors[0].longMessage)
			})
	}

	return {
		isLoaded,
		isSignedIn,
		createResetCode,
		handleReset,
	}
}
