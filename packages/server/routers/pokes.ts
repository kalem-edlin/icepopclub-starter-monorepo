import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { pokes, users } from "../db/schema"
import { createTRPCRouter, publicProcedure } from "../utils/trpc"

const pokesRouter = createTRPCRouter({
	sendPoke: publicProcedure
		.input(
			z.object({
				pokedUserId: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.userId) return []
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
				return []
			}
		}),
	getAllUsers: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.userId) return []
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
