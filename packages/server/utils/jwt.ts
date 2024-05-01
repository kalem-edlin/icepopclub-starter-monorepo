import { env } from "@monoexpo/env/server"
import { TRPCError } from "@trpc/server"
import jwt, { JwtPayload } from "jsonwebtoken"
import z, { ZodError } from "zod"

// This is defined as a custom JWT schema on the clerk dashboard
export const zExpectedJWT = z.object({
	auth_id: z.string().min(1),
	primary: z.string().min(1),
	external_id: z.string().min(1),
})

/**
 * Verify using jsonwebtoken and Parse using zod.
 * TODO: take in required role/authorization parameters and validate them here
 * @param token
 * @returns
 */
export const verifyAndParseToken = (token: string | undefined) => {
	const publicKey = env.CLERK_PEM_PUBLIC_KEY
	if (!token) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	let decoded
	try {
		decoded = jwt.verify(token, publicKey) as JwtPayload
		if (!decoded) {
			throw new Error(
				`could not decode token: ${token}\n with pem: ${publicKey}`
			)
		}
		const parsed = zExpectedJWT.parse(decoded)
		const userId: number = +parsed.external_id
		if (isNaN(userId)) {
			throw new Error(
				`NaN: external_id is not a valid number ${parsed.external_id}`
			)
		}
		console.log(
			`Successfuly decoded and parsed JWT template ${env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE_NAME} for ${userId}:${parsed.auth_id} with ${parsed.primary}`
		)
		return {
			userId,
			authId: parsed.auth_id,
			primary: parsed.primary,
		}
	} catch (error) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: `Cannot authenticate JWT due to missing auth information ${error instanceof ZodError && `given decoded: ${JSON.stringify(decoded)}\n`}with error: ${error}`,
		})
	}
}
