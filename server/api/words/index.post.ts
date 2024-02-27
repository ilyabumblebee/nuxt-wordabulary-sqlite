import { useValidatedBody, z } from 'h3-zod'
import { sendError, createError } from 'h3'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  // Attempt to validate the request body
  let content
  try {
    ({ content } = await useValidatedBody(event, {
      content: z.string().min(1).max(100),
    }))
  } catch (error) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: 'Invalid request data. Please ensure your content is a string between 1 and 100 characters.',
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

  // Proceed to insert the word if the user is authorized
  let word
  try {
    word = await useDB().insert(tables.words).values({
      userId: session.user.sub,
      content,
      createdAt: Date.now(),
    }).returning().get()
  } catch (error) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: 'Failed to insert word into database',
    }))
  }

  return word
})
