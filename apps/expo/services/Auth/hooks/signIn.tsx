import { useSignIn } from "@clerk/clerk-expo"

export const useSignInService = () => {
	const { signIn, setActive, isLoaded } = useSignIn()

	const onSignIn = async (
		identifier: string,
		password: string,
		callback: () => void
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
			console.log(err)
		}
	}

	return { onSignIn }
}
