import { env } from "@acme/env/server"
import { TRPCError, initTRPC } from "@trpc/server"
import { ZodError } from "zod"
import { verifyAndParseToken } from "./jwt"
export { createNextApiHandler } from "@trpc/server/adapters/next"

import { CreateNextContextOptions } from "@trpc/server/adapters/next"
// @ts-ignore
import transformer from "superjson"

/**
 * Extract authorization header from request and pass to trpc routes
 * @param opts
 * @returns {authorization} - string token for authentication
 */
export const createContext = async (opts: CreateNextContextOptions) => {
	return {
		authorization: opts.req.headers.authorization?.split(" ")[1],
	} as {
		authorization?: string
	}
}

/**
 * Create trpc server instance with error formatting and logging
 */
const t = initTRPC.context<typeof createContext>().create({
	transformer,
	errorFormatter(opts) {
		const { shape, error } = opts
		console.log(
			`Encountered TRPC error with code ${error.code}\nand message ${error.message}`
		)
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === "BAD_REQUEST" &&
					error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		}
	},
})

/**
 * Take authorization from context, decode JWT and authenticate the user.
 * For routes that require an active user
 * @param opts
 * @returns {UserId, SessionId} - for router information where needed
 */
const withAuthentication = t.middleware(({ ctx, next }) => {
	return next({
		ctx: verifyAndParseToken(ctx.authorization),
	})
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
