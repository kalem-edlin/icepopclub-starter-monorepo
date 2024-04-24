import {
	boolean,
	pgTableCreator,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core"

// Create a pgTable that maps to a table in your DB
export const createTable = pgTableCreator(
	(name) => `${process.env.NAME}_${name}`
)

export const users = createTable(
	`users`,
	{
		id: uuid("id").primaryKey(),
		first_name: text("first_name"),
		last_name: text("last_name"),
		// Have either email address or phone non null
		primary_email_address_id: text("primary_email_address_id").notNull(),
		primary_phone_number_id: text("primary_phone_number_id"),
		image_url: text("image_url"),
		has_image: boolean("has_image"),
		username: text("username"),
		createdAt: timestamp("createdAt").defaultNow().notNull(),
		active: boolean("active").default(true),
	},
	(users) => {
		return {
			// Change on to primary identifier
			uniqueIdx: uniqueIndex("unique_idx").on(
				users.primary_email_address_id
			),
		}
	}
)
