import { useAuth, useSignIn } from "@clerk/clerk-expo"

export const useForgotService = () => {
	const { isSignedIn } = useAuth()
	const { isLoaded, signIn, setActive } = useSignIn()

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
