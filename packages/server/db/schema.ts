import { env } from "@monoexpo/env/server"
import {
	boolean,
	integer,
	pgTableCreator,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core"

// Create a pgTable that maps to a table in your DB
export const createTable = pgTableCreator(
	(name) => `${env.PROJECT_NAME}_${name}`
)

export const users = createTable(`users`, {
	id: text("id").primaryKey(),
	// PRIMARY_USER_LOGIN
	emailAddress: text("emailAddress").notNull().unique(), // email address, username, or phone number
	firstName: text("firstName"),
	lastName: text("lastName"),
	imageUrl: text("imageUrl"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	active: boolean("active").default(true).notNull(),
})

export const pokes = createTable(`pokes`, {
	id: serial("id").primaryKey(),
	senderId: text("senderId").references(() => users.id, {
		onUpdate: "cascade",
	}),
	recieverId: text("recieverId").references(() => users.id, {
		onUpdate: "cascade",
	}),
})

export const files = createTable(`files`, {
	id: serial("id").primaryKey(),
	userId: text("userId").references(() => users.id, { onUpdate: "cascade" }),
	name: text("name").notNull(),
	s3Key: text("url").notNull().unique(),
	mimeType: text("mimeType").notNull(),
	mbSize: integer("mbSize"),
})
