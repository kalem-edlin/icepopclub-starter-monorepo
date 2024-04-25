import { createTRPCRouter } from "../trpc"
import filesRouter from "./files"
import pokesRouter from "./pokes"
import usersRouter from "./users"

export const appRouter = createTRPCRouter({
	users: usersRouter,
	files: filesRouter,
	pokes: pokesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
