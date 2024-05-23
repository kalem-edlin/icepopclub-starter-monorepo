import { appRouter } from "@acme/server"
import { createContext, createNextApiHandler } from "@acme/server/utils"
import { env } from "process"

export default createNextApiHandler({
	router: appRouter,
	createContext,
	onError:
		env.NODE_ENV === "development"
			? ({ path, error }) => {
					console.error(
						`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
					)
				}
			: undefined,
})
