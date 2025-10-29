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

export function Recipes() {
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
      <br />
      <details>
        <summary style={{ fontSize: '1rem', fontWeight: 750 }}>
          Create Recipe
        </summary>
        <br />
        <CreateRecipe />
      </details>
      <br />
      <details>
        <summary style={{ fontSize: '1rem', fontWeight: 750 }}>
          Modify Recipe
        </summary>
        <br />
        <ModifyRecipe />
      </details>
      <br />
      <details>
        <summary style={{ fontSize: '1rem', fontWeight: 750 }}>
          Delete Recipe
        </summary>
        <br />
        <DeleteRecipe />
      </details>
      <br />
      <hr />
      <h4>Filter Options</h4>

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
      <br />
      <hr />
      <RecipeList recipes={recipes} />
    </div>
  )
}
