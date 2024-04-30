import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { users } from "../db/schema"
import { zInsertUser } from "../db/zod"
import { createTRPCRouter, internalProcedure } from "../utils/trpc"

const usersRouter = createTRPCRouter({
	/**
	 * Internal procedure to create a new user record given the Primary User Login has not existed in the past
	 * Otherwise update user
	 * This will update the primary ID of user and cascade primary key changes if user is to reactivate account
	 */
	createUser: internalProcedure
		.input(zInsertUser)
		.mutation(async ({ input }) => {
			const user = await db.query.users.findFirst({
				// PRIMARY_USER_LOGIN
				where: eq(users.emailAddress, input.emailAddress),
			})
			if (user) {
				return await db
					.update(users)
					.set({
						...input,
						active: true,
					})
					.where(eq(users.emailAddress, input.emailAddress))
			} else {
				return await db.insert(users).values(input)
			}
		}),

	/**
	 * Internal procedure to update a user given authIds match
	 */
	updateUser: internalProcedure
		.input(zInsertUser)
		.mutation(async ({ input }) => {
			console.log("Hitting internal route to update user!")
			return await db
				.update(users)
				.set(input)
				.where(eq(users.id, input.id))
		}),

	/**
	 * Delete a user by setting the user record to inactive, removing private data
	 * Retains the user record identified by the Primary User Login
	 */
	deleteUser: internalProcedure
		.input(z.string())
		.mutation(async ({ input }) => {
			console.log("Hitting internal route to delete user!")
			return await db
				.update(users)
				.set({
					active: false,
					firstName: null,
					lastName: null,
					imageUrl: null,
				})
				.where(eq(users.id, input))
		}),
})

export default usersRouter
