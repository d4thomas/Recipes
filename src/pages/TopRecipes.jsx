import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

import { RecipeList } from '../components/RecipeList.jsx'
import { Header } from '../components/Header.jsx'
import { GET_RECIPES } from '../api/graphql/recipes.js'

export function TopRecipes() {
  const recipesQuery = useGraphQLQuery(GET_RECIPES, {
    variables: {
      author: '',
      options: { sortBy: 'likes', sortOrder: 'descending' },
    },
  })
  const recipes = recipesQuery.data?.recipes ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Top Recipes</title>
        <meta name='description' content='Browse the top recipes' />
      </Helmet>
      <h1>Top Recipes</h1>
      <hr />
      <Header />
      <hr />
      <h3>
        <Link to='/'>Main Page</Link>
      </h3>
      <hr />
      <RecipeList recipes={recipes} />
    </div>
  )
}
