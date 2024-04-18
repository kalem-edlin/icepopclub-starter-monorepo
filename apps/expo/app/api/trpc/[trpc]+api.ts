import { appRouter } from "@repo/server/routers/_app"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { ExpoRequest } from "expo-router/server"

export async function GET(req: ExpoRequest) {
	console.log(`get request ${req}`)
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext: async () => {
			return {}
		},
	})
}

export async function POST(req: ExpoRequest) {
	console.log(`post request ${req}`)
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext: async () => {
			return {}
		},
	})
}
