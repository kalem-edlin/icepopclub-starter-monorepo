import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { users } from "../db/schema"
import { zInsertUser } from "../db/zod"
import {
	authenticatedProcedure,
	createTRPCRouter,
	internalProcedure,
} from "../utils/trpc"

const usersRouter = createTRPCRouter({
	getUserAndUpdateUserIfNotExists: authenticatedProcedure
		.input(zInsertUser)
		.mutation(async ({ input, ctx }) => {
			const user = await db.query.users.findFirst({
				where: eq(users.id, input.id),
			})
			if (!user) {
				console.log(
					`webhook failed to update in 20 seconds. Automatically adding user!!!`
				)
				return await db.insert(users).values(input)
			}
			return user
		}),
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
