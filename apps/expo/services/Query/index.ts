import type { AppRouter } from "@acme/server/shared"
import { createTRPCReact } from "@trpc/react-query"

export const trpc = createTRPCReact<AppRouter>()
