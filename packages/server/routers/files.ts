import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "../db"
import { files } from "../db/schema"
import { zInsertFile } from "../db/zod"
import { authenticatedProcedure, createTRPCRouter } from "../utils/trpc"
import {
	getPresignedUrl,
	maxFilesPerUpload,
	zFileDetails,
} from "../utils/upload"

/**
 * This router provides ability to post files to DB File Table, Get all files for a given user, and presign File upload URLs with S3
 */
const filesRouter = createTRPCRouter({
	postFiles: authenticatedProcedure
		.input(z.array(zInsertFile.omit({ userId: true })))
		.mutation(async ({ input, ctx }) => {
			return await db.insert(files).values(
				input.map((insertFileData) => {
					return {
						...insertFileData,
						userId: ctx.userId,
					}
				})
			)
		}),
	getUserFiles: authenticatedProcedure
		.input(z.number())
		.query(async ({ input, ctx }) => {
			return await db.query.files.findMany({
				where: eq(files.userId, input),
			})
		}),
	getFileUploadPresignedUrls: authenticatedProcedure
		.input(z.array(zFileDetails))
		.mutation(async ({ input, ctx }) => {
			if (input.length > maxFilesPerUpload) {
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Cannot upload more than 10 files at a time",
				})
			}
			const promises = input.map(async (file) => {
				return await getPresignedUrl(file)
			})
			return await Promise.all(promises)
		}),
	reportS3UploadFailure: authenticatedProcedure
		.input(
			z.object({
				fileKey: z.string(),
				fileSize: z.number(),
				fileType: z.string(),
			})
		)
		.mutation(({ input, ctx }) => {
			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: `File upload failed on client for user ${ctx.userId}, fileKey ${input.fileKey}, fileSize ${input.fileSize}, fileType ${input.fileType}`,
			})
		}),
})

export default filesRouter
