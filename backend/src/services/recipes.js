import { Recipe } from '../db/models/recipe.js'

// Create recipe
export async function createRecipe({ title, author, contents, tags }) {
  const recipe = new Recipe({ title, author, contents, tags })
  return await recipe.save()
}
