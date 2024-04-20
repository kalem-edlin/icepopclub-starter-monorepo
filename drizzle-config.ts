import { type Config } from "drizzle-kit";


export default {
  schema: "./packages/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL as string,
  },
  tablesFilter: [`${process.env.NAME}_*`],
} satisfies Config;