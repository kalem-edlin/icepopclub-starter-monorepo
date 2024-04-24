import { users } from "./schema"

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
