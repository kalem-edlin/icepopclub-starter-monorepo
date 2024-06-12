import { createTRPCRouter } from "../utils/trpc"
import filesRouter from "./files"
import interviewRouter from "./interview"
import pokesRouter from "./pokes"
import usersRouter from "./users"

export const appRouter = createTRPCRouter({
	users: usersRouter,
	files: filesRouter,
	pokes: pokesRouter,
	interview: interviewRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
