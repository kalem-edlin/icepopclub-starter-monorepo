import type { UserJSON, WebhookEvent } from "@clerk/backend"
import { users } from "./schema"

export { WebhookEvent }

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

// All metadata should be defined here that is necessary to be pulled to the frontend and set from the AuthProvider datastore
export interface AuthUser extends UserJSON {
	active: User["active"]
}
