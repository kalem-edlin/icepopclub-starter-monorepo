import type { AppRouter } from "@repo/server/routers/_app"
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()
