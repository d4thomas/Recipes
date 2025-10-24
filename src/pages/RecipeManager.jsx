// import { useQuery } from '@tanstack/react-query'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { Helmet } from 'react-helmet-async'
import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { ModifyRecipe } from '../components/ModifyRecipe.jsx'
import { DeleteRecipe } from '../components/DeleteRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
// import { getRecipes } from '../api/recipes.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { GET_RECIPES, GET_RECIPES_BY_AUTHOR } from '../api/graphql/recipes.js'

export function RecipeManager() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  //   const recipesQuery = useQuery({
  //     queryKey: ['recipes', { author, sortBy, sortOrder }],
  //     queryFn: () => getRecipes({ author, sortBy, sortOrder }),
  //   })

  //   const recipes = recipesQuery.data ?? []

  const recipesQuery = useGraphQLQuery(
    author ? GET_RECIPES_BY_AUTHOR : GET_RECIPES,
    {
      variables: { author, options: { sortBy, sortOrder } },
    },
  )
  const recipes =
    recipesQuery.data?.recipesByAuthor ?? recipesQuery.data?.recipes ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Recipe Manager</title>
        <meta name='description' content='A full-stack React recipe manager' />
      </Helmet>
      <Header />
      <br />
      <hr />
      <br />
      <CreateRecipe />
      <br />
      <hr />
      <br />
      <ModifyRecipe />
      <br />
      <hr />
      <br />
      <DeleteRecipe />
      <br />
      <hr />
      <b>
        <i>
          <u>Filter</u>
        </i>
      </b>
      <br />
      <br />
      <RecipeFilter
        field='Author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <RecipeSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <RecipeList recipes={recipes} />
    </div>
  )
}
