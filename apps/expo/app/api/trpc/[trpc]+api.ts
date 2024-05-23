import { appRouter } from "@monoexpo/server"
import { createContext, fetchRequestHandler } from "@monoexpo/server/utils"

export async function GET(req: Request) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})
}

export async function POST(req: Request) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})
}
