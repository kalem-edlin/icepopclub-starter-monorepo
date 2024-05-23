import { useSignUp } from "@clerk/clerk-expo"

export const useSignUpService = () => {
	const { isLoaded, signUp, setActive } = useSignUp()
	// start the sign up process.
	const onSignUp = async (
		identifier: string,
		password: string,
		callback: (errorMessage?: string) => void,
		firstName: string,
		lastName?: string,
		metadata?: { [k: string]: unknown }
	) => {
		if (!isLoaded) return

		try {
			await signUp.create({
				emailAddress: identifier,
				password,
				firstName,
				lastName,
				unsafeMetadata: metadata,
			})

			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			})

			callback()
		} catch (err: any) {
			callback((err as Error).message)
		}
	}

	const onVerify = async (
		code: string,
		callback: (errorMessage?: string) => void
	) => {
		if (!isLoaded) return

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification(
				{
					code,
				}
			)

			await setActive({ session: completeSignUp.createdSessionId })
			callback()
		} catch (err) {
			callback((err as Error).message)
		}
	}

	return { onSignUp, onVerify }
}
