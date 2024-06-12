import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "../db"
import { presses } from "../db/schema"
import { createTRPCRouter, publicProcedure } from "../utils/trpc"

/**
 * This router provides an example "poking" system for users to poke each other
 */
const interviewRouter = createTRPCRouter({
	/**
	 * If user has already poked target, return
	 * Add new poke record involving current and target user
	 */
	byId: publicProcedure
		.input(
			z.object({
				id: z.number().optional(),
			})
		)
		.query(async ({ input, ctx }): Promise<number | undefined> => {
			if (!input.id) return
			const pressesResult = (
				await db
					.select()
					.from(presses)
					.where(eq(presses.id, input.id))
					.limit(1)
			)[0]
			console.log(pressesResult)
			if (!pressesResult) {
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message: "User already poked",
				})
			}
			return pressesResult.count
		}),

	create: publicProcedure.mutation(async ({ ctx }): Promise<number> => {
		const createdResult = (
			await db.insert(presses).values({}).returning()
		)[0]
		console.log(createdResult)
		if (!createdResult) {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "presses id not created",
			})
		}
		return createdResult.id
	}),

	update: publicProcedure
		.input(z.object({ id: z.number(), count: z.number() }))
		.mutation(async ({ input, ctx }): Promise<number> => {
			const updatedResult = (
				await db
					.update(presses)
					.set({ count: input.count })
					.where(eq(presses.id, input.id))
					.returning()
			)[0]
			console.log(updatedResult)
			if (!updatedResult) {
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "presses id not updated",
				})
			}
			return updatedResult.count
		}),
})

export default interviewRouter
