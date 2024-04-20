import { pgTableCreator, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

// Create a pgTable that maps to a table in your DB
export const createTable = pgTableCreator((name) => `${process.env.NAME}_${name}`);

export const users = createTable(
    `users`,
    {
      id: serial('id').primaryKey(),
      firstName: text('name').notNull(),
      lastName: text('name'),
      email: text('email').notNull(),
      image: text('image'),
      createdAt: timestamp('createdAt').defaultNow().notNull(),
    },
    (users) => {
      return {
        uniqueIdx: uniqueIndex('unique_idx').on(users.email),
      };
    },
  );
