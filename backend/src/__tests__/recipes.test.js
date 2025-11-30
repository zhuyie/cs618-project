import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []
beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  sampleRecipes = [
    {
      title: 'Test recipe',
      author: testUser._id,
      ingredients: ['1 cup xxx', '1/4 cup yyy'],
      image: 'https://example.com/cookies.jpg',
    },
    {
      title: 'Chocolate Chip Cookies',
      author: testUser._id,
      ingredients: [
        '2 1/4 cups all-purpose flour',
        '1 tsp baking soda',
        '1 cup butter, softened',
        '3/4 cup granulated sugar',
        '3/4 cup brown sugar',
        '2 large eggs',
        '2 cups chocolate chips',
      ],
      image: 'https://example.com/cookies.jpg',
    },
  ]
})

let createdSampleRecipes = []
beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})

describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})

describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      ingredients: ['some ingredients change'],
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.ingredients[0]).toEqual('some ingredients change')
  })
  test('should not update other properties', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      ingredients: ['some ingredients change'],
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Test recipe')
  })
  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      ingredients: ['some ingredients change'],
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(
      testUser._id,
      '000000000000000000000000',
      {
        ingredients: ['some ingredients change'],
      },
    )
    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe(testUser._id, '000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})

describe('listing recipes', () => {
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })
  test('should return recipes sorted by creation date descending by default', async () => {
    const recipes = await listAllRecipes()
    const sortedSampleRecipes = createdSampleRecipes.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(recipes.map((recipe) => recipe.createdAt)).toEqual(
      sortedSampleRecipes.map((recipe) => recipe.createdAt),
    )
  })
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
  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(2)
  })
})

describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'New Recipe No. 1',
      ingredients: ['1 cup xxx', '1/4 cup yyy'],
      image: 'https://example.com/cookies.jpg',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const recipe = {
      ingredients: ['1 cup xxx', '1/4 cup yyy'],
      image: 'https://example.com/cookies.jpg',
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
