import { gql } from '@apollo/client/core/index.js'

export const RECIPE_FIELDS = gql`
  fragment RecipeFields on Recipe {
    id
    title
    contents
    tags
    image
    likes
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
  ${RECIPE_FIELDS}
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
      ...RecipeFields
    }
  }
`

export const MODIFY_RECIPE = gql`
  ${RECIPE_FIELDS}
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
      ...RecipeFields
    }
  }
`

export const DELETE_RECIPE = gql`
  mutation deleteRecipe($id: String!) {
    deleteRecipe(id: $id)
  }
`

export const LIKE_RECIPE = gql`
  mutation likeRecipe($id: String!) {
    likeRecipe(id: $id) {
      id
      likes
    }
  }
`
