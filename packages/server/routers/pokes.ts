import { and, count, eq, sql } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { pokes, users } from "../db/schema"
import { createTRPCRouter, publicProcedure } from "../trpc"

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
						eq(pokes.reciever_id, input.pokedUserId),
						eq(pokes.sender_id, ctx.userId)
					)
				)
			if (existing.length > 1) {
				return await db.insert(pokes).values({
					reciever_id: input.pokedUserId,
					sender_id: ctx.userId,
				})
			} else {
				return []
			}
		}),
	getAllUsers: publicProcedure.query(async ({ input, ctx }) => {
		if (!ctx.userId) return []
		return await db
			.select({
				data: users,
				pokes: count(),
				alreadyPoked: sql<number>`SUM(CASE WHEN ${pokes.sender_id} = ${ctx.userId} THEN 1 ELSE 0 END)`,
			})
			.from(users)
			.leftJoin(pokes, eq(users.id, pokes.reciever_id))
			.groupBy(users.id)
	}),
})

export default pokesRouter
