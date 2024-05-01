import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { users } from "../db/schema"
import { zInsertUser } from "../db/zod"
import { createTRPCRouter, internalProcedure } from "../utils/trpc"

const usersRouter = createTRPCRouter({
	/**
	 * Internally create user if they do not already exist returning created userId for clerk update
	 * if exists return userId for clerk update regardless and do not insert
	 * @param zInsertUser without ID parsed from clerk webhook
	 */
	createUser: internalProcedure
		.input(zInsertUser.omit({ id: true }))
		.mutation(
			async ({
				input,
			}): Promise<{
				foundUserId: number
			}> => {
				const user = await db.query.users.findFirst({
					// PRIMARY_USER_LOGIN
					where: eq(users.emailAddress, input.emailAddress),
				})
				if (user) {
					if (user.authId && !user.deactivatedAt) {
						throw new TRPCError({
							code: "CONFLICT",
							message:
								"Auth User already active for this login identifier",
						})
					} else {
						return {
							foundUserId: user.id,
						}
					}
				} else {
					const result = await db
						.insert(users)
						.values(input)
						.returning({ foundUserId: users.id })
					if (!result[0]) {
						throw new TRPCError({
							code: "INTERNAL_SERVER_ERROR",
							message: `Could not insert user with authId ${input.authId}`,
						})
					}
					return {
						foundUserId: result[0].foundUserId,
					}
				}
			}
		),

	/**
	 * Internal procedure to update a user given authIds match
	 */
	updateUser: internalProcedure
		.input(z.object({ id: z.number(), user: zInsertUser }))
		.mutation(async ({ input }) => {
			const result = await db
				.update(users)
				.set(input)
				.where(eq(users.id, input.id))
			if (result.rowCount === 0) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: `Could not update user with id ${input.id}`,
				})
			}
		}),

	/**
	 * Delete a user by setting the user record to inactive, removing private data
	 * Retains the user record identified by the Primary User Login
	 * @Params authId - clerk authentication id to identify user by and delete
	 */
	deleteUser: internalProcedure
		.input(z.string())
		.mutation(async ({ input }) => {
			const result = await db
				.update(users)
				.set({
					authId: undefined,
					deactivatedAt: new Date(),
					firstName: null,
					lastName: null,
					imageUrl: null,
				})
				.where(eq(users.authId, input))
			if (result.rowCount === 0) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: `Could not delete user with authId ${input}`,
				})
			}
		}),
})

export default usersRouter
