import { initTRPC } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

export const createContext = async (
	opts: FetchCreateContextFnOptions
): Promise<{ userId?: string }> => {
	const { req } = opts

	return {
		userId: req.headers.get("authorization") ?? undefined,
	}
}

const t = initTRPC.context<typeof createContext>().create()

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const createCallerFactory = t.createCallerFactory
