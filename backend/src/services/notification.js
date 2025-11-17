export async function sendRecipeNotification(io, recipe, creatorId) {
  const sockets = await io.fetchSockets()
  sockets.forEach((socket) => {
    if (socket.userId !== creatorId) {
      socket.emit('recipe.new', {
        id: recipe._id.toString(),
        title: recipe.title,
      })
    }
  })
}
