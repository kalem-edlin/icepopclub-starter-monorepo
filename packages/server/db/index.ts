import { sql } from "@vercel/postgres"
import { VercelPgQueryResultHKT, drizzle } from "drizzle-orm/vercel-postgres"

import { ExtractTablesWithRelations } from "drizzle-orm"
import { PgTransaction } from "drizzle-orm/pg-core"
import * as schema from "./schema"

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql, { schema })
export type dbType = typeof db
export type transactionType = PgTransaction<
	VercelPgQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>

// PRIMARY_USER_LOGIN should be updated across app when choosing between username, email address and phonenumber
