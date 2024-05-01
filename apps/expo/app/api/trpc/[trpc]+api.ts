import { appRouter } from "@monoexpo/server"
import { createContext, fetchRequestHandler } from "@monoexpo/server/utils"

import { ExpoRequest } from "expo-router/server"

export async function GET(req: Request) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})
}

export async function POST(req: ExpoRequest) {
	return fetchRequestHandler({
		endpoint: "/api/trpc",
		req: req as unknown as Request,
		router: appRouter,
		createContext,
	})
}
