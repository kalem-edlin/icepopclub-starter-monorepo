import { env } from "@monoexpo/env/server"
import {
	boolean,
	integer,
	pgTableCreator,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core"

// Create a pgTable that maps to a table in your DB
export const createTable = pgTableCreator(
	(name) => `${env.PROJECT_NAME}_${name}`
)

export const users = createTable(
	`users`,
	{
		id: text("id").primaryKey(),
		firstName: text("firstName"),
		lastName: text("lastName"),
		// Have either email address or phone non null
		emailAddress: text("emailAddress").notNull(),
		phoneNumber: text("phoneNumber"),
		imageUrl: text("imageUrl"),
		username: text("username"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),

		// All properties below are meta data properties of Clerk that must provide defaults
		active: boolean("active").default(true),
	},
	(users) => {
		return {
			// Change on to primary identifier
			uniqueIdx: uniqueIndex("unique_idx").on(users.emailAddress),
		}
	}
)

export const pokes = createTable(`pokes`, {
	id: serial("id").primaryKey(),
	senderId: text("senderId").references(() => users.id),
	recieverId: text("recieverId").references(() => users.id),
})

export const files = createTable(`files`, {
	id: serial("id").primaryKey(),
	userId: text("userId").references(() => users.id),
	name: text("name").notNull(),
	s3Key: text("url").notNull().unique(),
	mimeType: text("mimeType").notNull(),
	mbSize: integer("mbSize"),
})
