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

const filesRouter = createTRPCRouter({
	postFiles: authenticatedProcedure
		.input(z.array(zInsertFile))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.userId) return []
			return await db.insert(files).values(input)
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
