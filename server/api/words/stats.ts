import { sql } from 'drizzle-orm'

export default eventHandler(async () => {
  // Count the total number of words
  return await useDB().select({
    words: sql<number>`count(*)`,
    users: sql<number>`count(distinct(${tables.words.userId}))`
  }).from(tables.words).get()
})