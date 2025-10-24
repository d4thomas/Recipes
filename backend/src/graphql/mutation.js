import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createRecipe, updateRecipe } from '../services/recipes.js'

export const mutationSchema = `#graphql
  type Mutation {
    signupUser(username: String!, password: String!): User
    loginUser(username: String!, password: String!): String
    createRecipe(title: String!, contents: String, tags: [String], image: String): Recipe
    updateRecipe(id: String!, title: String, contents: String, tags: [String], image: String): Recipe
  }
`

export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },
    createRecipe: async (
      parent,
      { title, contents, tags, image },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      return await createRecipe(auth.sub, { title, contents, tags, image })
    },
    updateRecipe: async (
      parent,
      { title, contents, tags, image, id },
      { auth },
    ) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      return await updateRecipe(auth.sub, id, { title, contents, tags, image })
    },
  },
}
