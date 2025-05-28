import { text, pgTable, serial, timestamp, boolean } from 'drizzle-orm/pg-core';

// export const users = pgTable('users', {
//     id: serial('id').primaryKey(),
//     username: text('username').notNull().unique(),
// });

export const events = pgTable('events', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

