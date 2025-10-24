import { querySchema, queryResolver } from './query.js'
import { recipeSchema, recipeResolver } from './recipe.js'
import { userSchema, userResolver } from './user.js'

export const typeDefs = [querySchema, recipeSchema, userSchema]
export const resolvers = [queryResolver, recipeResolver, userResolver]
