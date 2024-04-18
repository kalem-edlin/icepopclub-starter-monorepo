import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

export default createTRPCRouter({
	getAllUsers: publicProcedure.query(
		async ({ ctx }): Promise<{ name: string }[]> => {
			// simulate a slow db call
			await new Promise((resolve) => setTimeout(resolve, 1000))
			try {
				return [{ name: "biiiitch" }] //users ?? []
			} catch (e) {
				console.log(e)
				return [{ name: JSON.stringify(e) }]
			}
		}
	),
	createUser: publicProcedure
		.input(
			z.object({
				name: z.string(),
			})
		)
		.mutation(async ({ input, ctx }): Promise<{ name: string }> => {
			// simulate a slow db call
			await new Promise((resolve) => setTimeout(resolve, 1000))
			try {
				return { name: "broken" }
			} catch (e) {
				return { name: JSON.stringify(e) }
			}
		}),
})
