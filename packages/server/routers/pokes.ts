import { TRPCError } from "@trpc/server"
import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { pokes, users } from "../db/schema"
import { authenticatedProcedure, createTRPCRouter } from "../utils/trpc"

/**
 * This router provides an example "poking" system for users to poke each other
 */
const pokesRouter = createTRPCRouter({
	/**
	 * If user has already poked target, return
	 * Add new poke record involving current and target user
	 */
	sendPoke: authenticatedProcedure
		.input(
			z.object({
				pokedUserId: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			if (ctx.userId === input.pokedUserId) {
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: "Cannot poke self",
				})
			}

			const existing = await db
				.select()
				.from(pokes)
				.where(
					and(
						eq(pokes.recieverId, input.pokedUserId),
						eq(pokes.senderId, ctx.userId)
					)
				)
			if (existing.length > 1) {
				return await db.insert(pokes).values({
					recieverId: input.pokedUserId,
					senderId: ctx.userId,
				})
			} else {
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: "User already poked",
				})
			}
		}),

	/**
	 * Get all users, poked count, and whether current user has poked them or not
	 */
	getAllUsers: authenticatedProcedure.query(async ({ ctx }) => {
		return await db
			.select({
				data: users,
				pokes: count(),
				alreadyPoked: sql<number>`SUM(CASE WHEN ${pokes.senderId} = ${ctx.userId} THEN 1 ELSE 0 END)`,
			})
			.from(users)
			.leftJoin(pokes, eq(users.id, pokes.recieverId))
			.groupBy(users.id)
	}),
})

export default pokesRouter
