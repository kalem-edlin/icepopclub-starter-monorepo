import { appRouter } from "@monoexpo/server/routers"
import { createContext, fetchRequestHandler } from "@monoexpo/server/utils"

import { ExpoRequest } from "expo-router/server"

export async function GET(req: Request) {
	console.log(`get request ${req}`)
	console.log(req.url)
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})
}

export async function POST(req: ExpoRequest) {
	console.log(`post request ${req}`)
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})
}
