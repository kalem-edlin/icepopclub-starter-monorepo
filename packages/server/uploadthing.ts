import { createUploadthing, type FileRouter } from "uploadthing/server"

const f = createUploadthing()

export const uploadRouter = {
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
	}).onUploadComplete((data) => {
		console.log("upload completed", data)
	}),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
