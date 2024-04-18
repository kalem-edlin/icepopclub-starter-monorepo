import { initTRPC } from "@trpc/server"

const t = initTRPC.context().create()

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure
