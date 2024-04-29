import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { users } from "../db/schema"
import { zInsertUser } from "../db/zod"
import { createTRPCRouter, internalProcedure } from "../utils/trpc"

const usersRouter = createTRPCRouter({
	createUser: internalProcedure
		.input(zInsertUser)
		.mutation(async ({ input, ctx }) => {
			return await db.insert(users).values(input)
		}),
	updateUser: internalProcedure
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
	deleteUser: internalProcedure
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			return await db
				.update(users)
				.set({ active: false })
				.where(eq(users.id, input))
		}),
})

export default usersRouter
