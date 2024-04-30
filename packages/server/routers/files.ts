import { eq } from "drizzle-orm"
import z from "zod"
import { db } from "../db"
import { files } from "../db/schema"
import { zInsertFile } from "../db/zod"
import { authenticatedProcedure, createTRPCRouter } from "../utils/trpc"
import {
	acceptedDocumentTypesRegex,
	acceptedImageTypesRegex,
	getPresignedUrl,
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
		.input(z.string())
		.query(async ({ input, ctx }) => {
			return await db.query.files.findMany({
				where: eq(files.userId, input),
			})
		}),
	getDocumentUploadPresignedUrls: authenticatedProcedure
		.input(z.array(zFileDetails))
		.mutation(async ({ input, ctx }) => {
			const promises = input.map(async (file) => {
				if (!acceptedDocumentTypesRegex.test(file.type)) {
					throw new Error(`Document type not accepted ${file.type}`)
				}
				return await getPresignedUrl(file)
			})
			return await Promise.all(promises)
		}),
	getImageUploadPresignedUrls: authenticatedProcedure
		.input(z.array(zFileDetails))
		.mutation(async ({ input, ctx }) => {
			const promises = input.map(async (file) => {
				if (!acceptedImageTypesRegex.test(file.type)) {
					throw new Error(`Document type not accepted ${file.type}`)
				}
				return await getPresignedUrl(file)
			})
			return await Promise.all(promises)
		}),
})

export default filesRouter
