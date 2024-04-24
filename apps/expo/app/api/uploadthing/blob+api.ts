import {
	createRouteHandler,
	createUploadthing,
	type FileRouter,
} from "@monoexpo/server/utils"

const f = createUploadthing()

const auth = (req: Request) => ({ id: "fakeId" }) // Fake auth function

export const { GET, POST } = createRouteHandler({
	router: {
		// Define as many FileRoutes as you like, each with a unique routeSlug
		fileUploader: f({
			pdf: {
				maxFileSize: "16MB",
				maxFileCount: 2,
			},
			audio: {
				maxFileSize: "32MB",
				maxFileCount: 1,
			},
			video: {
				maxFileSize: "32MB",
				maxFileCount: 1,
			},
			image: {
				maxFileSize: "4MB",
				maxFileCount: 4,
			},
		})
			// Set permissions and file types for this FileRoute
			.middleware(async ({ req }) => {
				// This code runs on your server before upload
				const user = await auth(req)

				// If you throw, the user will not be able to upload
				if (!user) throw new Error("Unauthorized")

				// Whatever is returned here is accessible in onUploadComplete as `metadata`
				return { userId: user.id }
			})
			.onUploadComplete(async ({ metadata, file }) => {
				// This code RUNS ON YOUR SERVER after upload
				console.log("Upload complete for userId:", metadata.userId)

				console.log("file url", file.url)

				// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
				return { uploadedBy: metadata.userId }
			}),
	} satisfies FileRouter,
	config: {
		uploadthingSecret: process.env.UPLOADTHING_SECRET,
	},
})
