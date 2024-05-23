import { defineConfig } from "drizzle-kit"
import { env } from "./packages/env/server"

export default defineConfig({
	schema: "./packages/server/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		// @ts-ignore
		url: env.POSTGRES_URL,
	},
	tablesFilter: [`${env.PROJECT_NAME}_*`],
	verbose: true,
	strict: true,
})
