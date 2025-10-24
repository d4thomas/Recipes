import { querySchema, queryResolver } from './query.js'
import { recipeSchema, recipeResolver } from './recipe.js'
import { userSchema, userResolver } from './user.js'
import { mutationSchema, mutationResolver } from './mutation.js'

export const typeDefs = [querySchema, recipeSchema, userSchema, mutationSchema]
export const resolvers = [
  queryResolver,
  recipeResolver,
  userResolver,
  mutationResolver,
]
