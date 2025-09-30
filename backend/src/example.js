import { initDatabase } from './db/init.js'
import { Recipe } from './db/models/recipe.js'

await initDatabase()

const recipe = new Recipe({
  title: 'Recipe Test',
  author: 'Daniel Thomas',
  contents: 'This recipe is stored in a MongoDB database using Mongoose.',
  tags: ['mongoose', 'mongodb', 'recipe'],
})

const createdRecipe = await recipe.save()

await Recipe.findByIdAndUpdate(createdRecipe._id, {
  $set: { title: 'Recipe Test... Again!' },
})

const recipes = await Recipe.find()
console.log(recipes)
