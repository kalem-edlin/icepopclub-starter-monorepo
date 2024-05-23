import { useSignUp, useUser } from "@clerk/clerk-expo"
import { Model } from "@monoexpo/server/shared"

export const useSignUpService = () => {
	const { isLoaded, signUp, setActive } = useSignUp()
	const { user } = useUser()
	// start the sign up process.
	const onSignUp = async (
		identifier: string,
		password: string,
		callback: () => void,
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
