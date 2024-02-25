export default eventHandler(async (event) => {
  // List words
  const words = await useDB().select().from(tables.words).all()

  return words
})
