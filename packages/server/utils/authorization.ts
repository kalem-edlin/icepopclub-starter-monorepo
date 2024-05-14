import { TRPCError } from "@trpc/server"
import { and, eq, isNotNull } from "drizzle-orm"
import { dbType, transactionType } from "../db"

type dbInstance = transactionType | dbType

export const checkUserAdminOfCommunity = async (
	db: dbInstance,
	communityId: number,
	userId: number
) => {
	const result = []

	// await db
	// .select()
	// .from()
	// .where(
	// )
	// .limit(1)

	if (result.length === 0) {
		return new TRPCError({
			code: "UNAUTHORIZED",
			message: `UserId ${userId} not authorized to administrate communityId ${communityId}`,
		})
	}
}

export const checkUserInCommunity = async (
	db: dbInstance,
	userId: number,
	communityId: number
) => {
	const result = await db
		.select()
		.from(members)
		.where(
			and(
				eq(members.userId, userId),
				eq(members.communityId, communityId),
				isNotNull(members.joinedAt)
			)
		)
		.limit(1)
	if (result.length === 0) {
		return new TRPCError({
			code: "UNAUTHORIZED",
			message: `UserId ${userId} is not a member of communityId ${communityId}`,
		})
	}
}
