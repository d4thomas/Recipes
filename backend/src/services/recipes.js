import { Recipe } from '../db/models/recipe.js'
import { User } from '../db/models/user.js'

// Create recipe
export async function createRecipe(userId, { title, contents, tags, image }) {
  const recipe = new Recipe({ title, author: userId, contents, tags, image })
  return await recipe.save()
}

// List recipes
async function listRecipes(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Recipe.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllRecipes(options) {
  return await listRecipes({}, options)
}

// List recipes by author
export async function listRecipesByAuthor(authorUsername, options) {
  const user = await User.findOne({ username: authorUsername })
  if (!user) return []
  return await listRecipes({ author: user._id }, options)
}

// List recipes by tag
export async function listRecipesByTag(tags, options) {
  return await listRecipes({ tags }, options)
}

// Get recipe by recipe ID
export async function getRecipeById(recipeId) {
  return await Recipe.findById(recipeId)
}

// Update recipe
export async function updateRecipe(
  userId,
  recipeId,
  { title, contents, tags, image },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId, author: userId },
    { $set: { title, contents, tags, image } },
    { new: true },
  )
}

// Delete recipe
export async function deleteRecipe(userId, recipeId) {
  return await Recipe.deleteOne({ _id: recipeId, author: userId })
}

// Like recipe
export async function likeRecipe(recipeId) {
  return await Recipe.findByIdAndUpdate(
    recipeId,
    { $inc: { likes: 1 } },
    { new: true },
  )
}
