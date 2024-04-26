import { TRPCError, initTRPC } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import jwt from "jsonwebtoken"

export const createContext = async (opts: FetchCreateContextFnOptions) => {
	const { req } = opts
	return {
		req,
	} as {
		req: Request
	}
}

const t = initTRPC.context<typeof createContext>().create()

const withAuthentication = t.middleware(({ ctx, next }) => {
	const publicJWTKey = (process.env.CLERK_PEM_PUBLIC_KEY ?? "").replaceAll(
		/\\n/g,
		"\n"
	)

	const token = ctx.req?.headers.get("Authorization")
	console.log(token)

	if (!token) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}

	try {
		let decoded = ""
		if (token) {
			decoded = jwt.verify(token, publicKey)
			res.status(200).json({ sessToken: decoded })
			return
		} else {
			decoded = jwt.verify(sessToken, publicKey)
			res.status(200).json({ sessToken: decoded })
			return
		}
	} catch (error) {
		res.status(400).json({
			error: "Invalid Token",
		})
		return
	}

	return next()
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const authenticatedProcedure = t.procedure.use(withAuthentication)

export const createCallerFactory = t.createCallerFactory
