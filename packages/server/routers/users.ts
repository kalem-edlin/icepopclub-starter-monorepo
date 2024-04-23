import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { users } from "../db/schema"
import { User } from "../db/types"
import { zInsertUser } from "../db/zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

export default createTRPCRouter({
	getOtherUsers: publicProcedure.query(async ({ ctx }) => {
		return []
	}),
	addFriend: publicProcedure
		.input(
			z.object({
				friendId: z.string(),
				selfId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }): Promise<User | undefined> => {
			return
		}),
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
