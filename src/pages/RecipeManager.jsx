// import { useQuery } from '@tanstack/react-query'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { RecipeList } from '../components/RecipeList.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { ModifyRecipe } from '../components/ModifyRecipe.jsx'
import { DeleteRecipe } from '../components/DeleteRecipe.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { GET_RECIPES, GET_RECIPES_BY_AUTHOR } from '../api/graphql/recipes.js'

export function RecipeManager() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

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
        <title>Recipes</title>
        <meta name='description' content='A full-stack React recipe manager' />
      </Helmet>
      <h1>Main Page</h1>
      <hr />
      <Header />
      <hr />
      <h3>
        <Link to='/top'>Top Recipes</Link>
      </h3>
      <hr />
      <h3>Create Recipe</h3>
      <CreateRecipe />
      <br />
      <hr />
      <h3>Modify Recipe</h3>
      <ModifyRecipe />
      <br />
      <hr />
      <h3>Delete Recipe</h3>
      <DeleteRecipe />
      <br />
      <hr />
      <h3>Filter Options</h3>

      <RecipeFilter
        field='Author Name'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <RecipeSorting
        fields={['createdAt', 'updatedAt', 'likes']}
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
