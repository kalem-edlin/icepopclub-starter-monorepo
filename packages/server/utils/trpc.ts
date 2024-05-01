import { env } from "@monoexpo/env/server"
import { TRPCError, initTRPC } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import jwt, { JwtPayload } from "jsonwebtoken"
import { zExpectedJWT } from "./jwt"

export { fetchRequestHandler } from "@trpc/server/adapters/fetch"

/**
 * Extract authorization header from request and pass to trpc routes
 * @param opts
 * @returns {authorization} - string token for authentication
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
	return {
		authorization: opts.req?.headers.get("Authorization")?.split(" ")[1],
	} as {
		authorization?: string
	}
}

const t = initTRPC.context<typeof createContext>().create()

/**
 * Take authorization from context, decode JWT and authenticate the user.
 * For routes that require an active user
 * @param opts
 * @returns {UserId, SessionId} - for router information where needed
 */
const withAuthentication = t.middleware(({ ctx, next }) => {
	const publicKey = env.CLERK_PEM_PUBLIC_KEY
	const token = ctx.authorization
	if (!token) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	try {
		const decoded = zExpectedJWT.parse(
			jwt.verify(token, publicKey) as JwtPayload
		)
		const userId: number = +decoded.external_id
		if (isNaN(userId)) {
			throw new Error(
				`external_id is not a valid number ${decoded.external_id}`
			)
		}
		return next({
			ctx: {
				userId,
				authId: decoded.auth_id,
			},
		})
	} catch (error) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: `Cannot authenticate JWT due to missing auth information: ${token} with error: ${error}`,
		})
	}
})

/**
 * Use authorization expecting server environmental variable APIKEY from internal calls from serverless function call
 * Used for routes that are updated within the server. Webhooks etc
 * NOT FOR USER CALLED ACTIONS
 */
const withInternal = t.middleware(({ ctx, next }) => {
	const apiKey = ctx.authorization
	if (apiKey !== env.PROJECT_INTERNAL_API_KEY) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	return next()
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const authenticatedProcedure = t.procedure.use(withAuthentication)

export const internalProcedure = t.procedure.use(withInternal)

export const createCallerFactory = t.createCallerFactory
