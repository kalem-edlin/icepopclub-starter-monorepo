export type * as Model from "./db/types"
export type { AppRouter } from "./routers/_app"
export {
	getUploadLimitsPerAcceptedMimeType,
	maxFilesPerUpload,
} from "./utils/upload"
// @ts-ignore
import superjson from "superjson"
export const transformer = superjson
