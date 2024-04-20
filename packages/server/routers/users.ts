import { z } from "zod"
import { User } from "../db/types"
import { createTRPCRouter, publicProcedure } from "../trpc"

export default createTRPCRouter({
	getOtherUsers: publicProcedure.query(
		async ({ ctx }): Promise<User[]> => {
            return []
		}
	),
    addFriend: publicProcedure.input(
        z.object({
            friendId: z.string(),
            selfId: z.string()
        })
    )
    .mutation(async ({ input, ctx }): Promise<User | undefined> => {
        return
    }),
	createUser: publicProcedure
		.input(
			z.object({
				firstName: z.string(),
                lastName: z.string().optional(),
                emailAddress: z.string(),
			})
		)
		.mutation(async ({ input, ctx }):  Promise<User | undefined> => {
			return 
		}),
})
