import { useSignUp } from "@clerk/clerk-expo"

export const useSignUpService = () => {
	const { isLoaded, signUp, setActive } = useSignUp()
	// start the sign up process.
	const onSignUp = async (
		identifier: string,
		password: string,
		callback: () => void,
		name?: { firstName: string; lastName?: string }
	) => {
		if (!isLoaded) return

		try {
			await signUp.create({
				emailAddress: identifier,
				password,
				firstName: name?.firstName,
				lastName: name?.lastName,
			})

			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			})

			callback()
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2))
		}
	}

	const onVerify = async (code: string, callback: () => void) => {
		if (!isLoaded) return

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification(
				{
					code,
				}
			)

			await setActive({ session: completeSignUp.createdSessionId })
			callback()
		} catch (err: any) {
			console.error(JSON.stringify(err, null, 2))
		}
	}

	return { onSignUp, onVerify }
}
