import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
//Remove old Sample recipes with this one
let sampleRecipes = []

beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  sampleRecipes = [
    { title: 'Learning Redux', author: testUser._id, tags: ['redux'] },
    { title: 'Learn React Hooks', author: testUser._id, tags: ['react'] },
    {
      title: 'Full-Stack React Projects',
      author: testUser._id,
      tags: ['react', 'nodejs'],
    },
  ]
})

// Define tests for creating recipes
describe('creating recipes', () => {
  // Test with all parameters
  test('with all parameters should succeed', async () => {
    // Create a new recipe
    const recipe = {
      title: 'Hello Mongoose!',
      contents: 'This recipe is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)

    // Verify return recipe ID
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)

    // Find recipe ID with Mongoose
    const foundRecipe = await Recipe.findById(createdRecipe._id)

    // Verify recipe ID
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })

  // Test without title
  test('without title should fail', async () => {
    const recipe = {
      contents: 'Recipe with no title',
      tags: ['empty'],
    }

    // Catch Mongoose validation error
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  // Test with minimal parameters
  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

// Create sample recipes in database
let createdSampleRecipes = []
beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})

// Define tests for listing recipes
describe('listing recipes', () => {
  // Test listing all recipes
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })

  // Test listing all recipes in descending order (no sort argument)
  test('should return recipes sorted by creation date descending by default', async () => {
    const recipes = await listAllRecipes()
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipes.map((recipe) => recipe.createdAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.createdAt),
    )
  })

  // Test listing all recipes in ascending order (with sort argument)
  test('should take into account provided sorting options', async () => {
    const recipes = await listAllRecipes({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )
    expect(recipes.map((recipe) => recipe.updatedAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.updatedAt),
    )
  })

  // Test listing all recipes by author
  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(3)
  })

  // Test listing all recipes by tag
  test('should be able to filter recipes by tag', async () => {
    const recipes = await listRecipesByTag('nodejs')
    expect(recipes.length).toBe(1)
  })
})

// Define test to get recipe by ID
describe('getting a recipe', () => {
  // Test with correct ID
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })

  // Test with incorrect ID
  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})

// Define tests to update recipes
describe('updating recipes', () => {
  // Test updating content
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      contents: 'Test content',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.contents).toEqual('Test content')
  })

  // Test data field integrity after update
  test('should not update other properties', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      contents: 'Test content',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Learning Redux')
  })

  // Test update time
  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      contents: 'Test content',
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })

  // Test updating invalid recipe ID
  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(
      testUser._id,
      '000000000000000000000000',
      {
        contents: 'Test content',
      },
    )
    expect(recipe).toEqual(null)
  })
})

// Define test to delete recipe
describe('deleting recipes', () => {
  // Test deleting valid recipe
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })

  // Test deleting invalid recipe
  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
