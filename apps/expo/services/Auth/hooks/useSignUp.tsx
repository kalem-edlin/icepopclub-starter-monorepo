import { Model } from "@acme/server/shared"
import { useSignUp, useUser } from "@clerk/clerk-expo"

export const useSignUpService = () => {
	const { isLoaded, signUp, setActive } = useSignUp()
	const { user } = useUser()
	// start the sign up process.
	const onSignUp = async (
		identifier: string,
		password: string,
		callback: (errorMessage?: string) => void,
		// PRIMARY_USER_LOGIN
		extraProperties: Omit<Model.InsertUser, "emailAddress">
	) => {
		if (!isLoaded) return

		try {
			await signUp.create({
				emailAddress: identifier,
				password,
				firstName: extraProperties.firstName ?? undefined,
				lastName: extraProperties.lastName ?? undefined,
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
		} catch (err: any) {
			callback((err as Error).message)
		}
	}

	return { onSignUp, onVerify }
}
