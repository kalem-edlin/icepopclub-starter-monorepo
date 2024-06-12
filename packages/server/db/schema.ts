import { env } from "@monoexpo/env/server"
import {
	integer,
	pgTableCreator,
	real,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core"

// Create a pgTable that maps to a table in your DB
export const createTable = pgTableCreator(
	(name) => `${env.PROJECT_NAME}_${name}`
)

export const presses = createTable(`presses`, {
	id: serial("id").primaryKey(),
	count: integer("count").notNull().default(0),
})

export const users = createTable(`users`, {
	id: serial("id").primaryKey(),
	// Auth id nullable for a deleted or unregistered account
	authId: text("authId").unique(),
	// PRIMARY_USER_LOGIN - email address, username, or phone number
	emailAddress: text("emailAddress").notNull().unique(),
	firstName: text("firstName"),
	lastName: text("lastName"),
	imageUrl: text("imageUrl"),
	createdAt: timestamp("createdAt").defaultNow().notNull(),
	deactivatedAt: timestamp("deactivatedAt"),
})

export const pokes = createTable(`pokes`, {
	id: serial("id").primaryKey(),
	senderId: serial("senderId")
		.notNull()
		.references(() => users.id),
	recieverId: serial("recieverId")
		.notNull()
		.references(() => users.id),
})

export const files = createTable(`files`, {
	id: serial("id").primaryKey(),
	userId: serial("userId")
		.notNull()
		.references(() => users.id),
	name: text("name").notNull(),
	s3Key: text("url").notNull().unique(),
	mimeType: text("mimeType").notNull(),
	mbSize: real("mbSize"),
})
