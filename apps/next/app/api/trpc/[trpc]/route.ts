import { appRouter } from "@monoexpo/server"
import { createContext, fetchRequestHandler } from "@monoexpo/server/utils"

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})

export { handler as GET, handler as POST }
