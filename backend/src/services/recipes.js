import { Recipe } from '../db/models/recipe.js'

// Create recipe
export async function createRecipe({ title, author, contents, tags }) {
  const recipe = new Recipe({ title, author, contents, tags })
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
export async function listRecipesByAuthor(author, options) {
  return await listRecipes({ author }, options)
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
  recipeId,
  { title, author, contents, tags },
) {
  return await Recipe.findOneAndUpdate(
    { _id: recipeId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

// Delete recipe
export async function deleteRecipe(recipeId) {
  return await Recipe.deleteOne({ _id: recipeId })
}
