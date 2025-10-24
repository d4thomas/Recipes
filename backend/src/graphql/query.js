import {
  getRecipeById,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
} from '../services/recipes.js'

export const querySchema = `#graphql
  type Query {
      test: String
      recipes: [Recipe!]!
      recipesByAuthor(username: String!): [Recipe!]!
      recipesByTag(tag: String!): [Recipe!]!
      recipeById(id: ID!): Recipe
  }
`
export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello World from GraphQL!'
    },
    recipes: async () => {
      return await listAllRecipes()
    },
    recipesByAuthor: async (parent, { username }) => {
      return await listRecipesByAuthor(username)
    },
    recipesByTag: async (parent, { tag }) => {
      return await listRecipesByTag(tag)
    },
    recipeById: async (parent, { id }) => {
      return await getRecipeById(id)
    },
  },
}
