/**
 * https://orm.drizzle.team/learn/guides/cursor-based-pagination -> cursors work with scope to prevent limit/offset performance issues
 * https://orm.drizzle.team/learn/guides/limit-offset-pagination -> deferred joins work to join data to already existing paginated table increasing performance
 */

import { SQL } from "drizzle-orm"
import { PgColumn, PgSelect } from "drizzle-orm/pg-core"

/**
 * Drizzle based function to paginate over a query
 * Usage: withPagination(query.$dynamic(), asc(users.id))
 * @param qb
 * @param orderByColumn
 * @param page
 * @param pageSize
 * @returns
 */
export default function withPagination<T extends PgSelect>(
	qb: T,
	orderByColumn: PgColumn | SQL | SQL.Aliased,
	page = 1,
	pageSize = 3
) {
	return qb
		.orderBy(orderByColumn)
		.limit(pageSize)
		.offset((page - 1) * pageSize)
}
