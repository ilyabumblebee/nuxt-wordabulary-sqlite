import { eq, and } from 'drizzle-orm'
import { useValidatedParams, zh } from 'h3-zod'

export default eventHandler(async (event) => {
  // Attempt to validate the request body
  let id
  try {
    ({ id } = await useValidatedParams(event, {
      id: zh.intAsString
    }))
  } catch (error) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: 'Failed to delete the word. Please ensure you have provided a valid identifier.',
    }))
  }
  
  // Attempt to retrieve the user session
  let session
  try {
    session = await requireUserSession(event)
  } catch (error) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      data: 'User session is required',
    }))
  }

  // Check if the user is authorized
  let authorized
  try {
    const result = await useDB().select().from(tables.users).where(eq(tables.users.id, session.user.sub))

    if (!result || result.length === 0 || result[0].authorized !== 1) {
      throw new Error('User is not eligible to add words')
    }
    authorized = true
  } catch (error) {
    return sendError(event, createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      data: error.message,
    }))
  }

  // Delete word
  let deletedWord = await useDB().delete(tables.words).where(eq(tables.words.id, id));
  
  if (!deletedWord) {
    throw createError({
      statusCode: 404,
      message: 'Word not found'
    })
  }
  return deletedWord
})
