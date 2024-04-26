import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { users } from "../db/schema"
import { zInsertUser } from "../db/zod"
import { createTRPCRouter, publicProcedure } from "../utils/trpc"

const usersRouter = createTRPCRouter({
	createUser: publicProcedure
		.input(zInsertUser)
		.mutation(async ({ input, ctx }) => {
			return await db.insert(users).values(input)
		}),
	updateUser: publicProcedure
		.input(
			z.object({
				id: z.string(),
				user: zInsertUser,
			})
		)
		.mutation(async ({ input, ctx }) => {
			return await db
				.update(users)
				.set(input.user)
				.where(eq(users.id, input.id))
		}),
	deleteUser: publicProcedure
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			return await db
				.update(users)
				.set({ active: false })
				.where(eq(users.id, input))
		}),
})

export default usersRouter
