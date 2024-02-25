import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const words = sqliteTable('words', {
  id: integer('id').primaryKey(),
  userId: text('user_id').notNull(),
  content: text('word').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  authorized: integer('authorized').notNull().default(0),
  createdAt: integer('created_at').notNull(),
})
