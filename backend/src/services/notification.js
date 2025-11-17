export function sendRecipeNotification(io, recipe) {
  io.emit('recipe.new', {
    id: recipe._id.toString(),
    title: recipe.title,
  })
}
