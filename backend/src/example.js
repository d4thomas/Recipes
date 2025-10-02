import { initDatabase } from './db/init.js'
import { Recipe } from './db/models/recipe.js'

await initDatabase()

const recipe = new Recipe({
  title: 'Recipe Test',
  author: 'Daniel Thomas',
  contents: 'Ingredient 1, Ingredient 2, ... Ingredient X',
  tags: ['mongoose', 'mongodb', 'recipe'],
  image:
    'https://static.vecteezy.com/system/resources/thumbnails/005/007/528/small/restaurant-food-kitchen-line-icon-illustration-logo-template-suitable-for-many-purposes-free-vector.jpg',
})

const createdRecipe = await recipe.save()

await Recipe.findByIdAndUpdate(createdRecipe._id, {
  $set: { title: 'Recipe Test... Again!' },
})

const recipes = await Recipe.find()
console.log(recipes)
