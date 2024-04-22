import type { AppRouter } from "@monoexpo/server/routers/_app"
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()
