import type { AppRouter } from "@monoexpo/server/shared"
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()
