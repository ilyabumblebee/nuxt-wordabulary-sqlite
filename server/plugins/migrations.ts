import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

export default defineNitroPlugin(async () => {
  try {
    if (process.dev) {
      migrate(useDB() as BetterSQLite3Database, { migrationsFolder: 'server/database/migrations' })
    }
  } catch (error) {
    console.error('Migration failed:', error)
  }
})
