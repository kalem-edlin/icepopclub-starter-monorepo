import { files, users } from "./schema"

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
export type InsertFile = typeof files.$inferInsert
export type InsertFileBody = Omit<InsertFile, "userId">
