export default oauth.githubEventHandler({
  async onSuccess(event, { user }) {
    const session = await setUserSession(event, { user })
    await useDB().insert(tables.users).values({
      id: session.user.id,
      createdAt: Date.now()
    }).onConflictDoNothing().returning().get()
    return sendRedirect(event, '/words')
  }
})
