import type { AppRouter } from "@monoexpo/server/routers"
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()
