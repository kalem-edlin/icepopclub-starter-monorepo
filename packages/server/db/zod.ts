import { createInsertSchema } from "drizzle-zod"
import { files, users } from "./schema"

export const zInsertUser = createInsertSchema(users)
export const zInsertFile = createInsertSchema(files)
