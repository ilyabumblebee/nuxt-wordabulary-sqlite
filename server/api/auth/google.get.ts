export default oauth.googleEventHandler({
  async onSuccess(event, { user }) {
    const session = await setUserSession(event, { user })
    await useDB().insert(tables.users).values({
      id: session.user.sub,
      createdAt: Date.now()
    }).onConflictDoNothing().returning().get()
    return sendRedirect(event, '/words')
  }
})
