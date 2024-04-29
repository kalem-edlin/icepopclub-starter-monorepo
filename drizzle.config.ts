import { type Config } from "drizzle-kit"
import { env } from "./packages/env/server"

export default {
	schema: "./packages/server/db/schema.ts",
	driver: "pg",
	dbCredentials: {
		connectionString: env.POSTGRES_URL,
	},
	tablesFilter: [`${env.PROJECT_NAME}_*`],
} satisfies Config
