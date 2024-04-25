import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "../db"
import { files } from "../db/schema"
import { zInsertFile } from "../db/zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

const filesRouter = createTRPCRouter({
	postFiles: publicProcedure
		.input(z.array(zInsertFile))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.userId) return []
			return await db.insert(files).values(input)
		}),
	getUserFiles: publicProcedure
		.input(z.string())
		.query(async ({ input, ctx }) => {
			return await db.query.files.findMany({
				where: eq(files.user_id, input),
			})
		}),
})

export default filesRouter
