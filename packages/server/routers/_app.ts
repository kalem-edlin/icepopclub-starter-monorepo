import { createTRPCRouter } from "../trpc"
import users from "./users"

export const appRouter = createTRPCRouter({
	users: users,
})

// export type definition of API
export type AppRouter = typeof appRouter
