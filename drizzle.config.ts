import { type Config } from "drizzle-kit"

if (!process.env.POSTGRES_URL) {
	throw new Error(`db connection string not supplied in env`)
}

if (!process.env.NAME) {
	throw new Error(`db connection string not supplied in env`)
}

export default {
	schema: "./packages/server/db/schema.ts",
	driver: "pg",
	dbCredentials: {
		connectionString: process.env.POSTGRES_URL as string,
	},
	tablesFilter: [`${process.env.NAME}_*`],
} satisfies Config
