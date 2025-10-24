import { gql } from '@apollo/client/core/index.js'

export const RECIPE_FIELDS = gql`
  fragment RecipeFields on Recipe {
    id
    title
    contents
    tags
    image
    updatedAt
    createdAt
    author {
      username
    }
  }
`
export const GET_RECIPES = gql`
  ${RECIPE_FIELDS}
  query getRecipes($options: RecipesOptions) {
    recipes(options: $options) {
      ...RecipeFields
    }
  }
`

export const GET_RECIPES_BY_AUTHOR = gql`
  ${RECIPE_FIELDS}
  query getRecipesByAuthor($author: String!, $options: RecipesOptions) {
    recipesByAuthor(username: $author, options: $options) {
      ...RecipeFields
    }
  }
`
export const CREATE_RECIPE = gql`
  mutation createRecipe(
    $title: String!
    $contents: String
    $tags: [String!]
    $image: String
  ) {
    createRecipe(
      title: $title
      contents: $contents
      tags: $tags
      image: $image
    ) {
      id
      title
    }
  }
`

export const MODIFY_RECIPE = gql`
  mutation updateRecipe(
    $id: String!
    $title: String
    $contents: String
    $tags: [String]
    $image: String
  ) {
    updateRecipe(
      id: $id
      title: $title
      contents: $contents
      tags: $tags
      image: $image
    ) {
      id
      title
    }
  }
`

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($id: String!) {
    deleteRecipe(id: $id)
  }
`
