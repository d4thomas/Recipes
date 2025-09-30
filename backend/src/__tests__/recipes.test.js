import mongoose from 'mongoose'
import { describe, expect, test } from '@jest/globals'
import { createRecipe } from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'First Recipe',
      author: 'Daniel Thomas',
      contents: 'This recipe is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb', 'recipe'],
    }
    const createdRecipe = await createRecipe(recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const recipe = {
      author: 'Daniel Thomas',
      contents: 'Recipe with no title...',
      tags: ['empty'],
    }
    try {
      await createRecipe(recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a Title',
    }
    const createdRecipe = await createRecipe(recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
