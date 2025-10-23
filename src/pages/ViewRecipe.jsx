import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Recipe } from '../components/Recipe.jsx'
import { getRecipeById } from '../api/recipes.js'
import { getUserInfo } from '../api/users.js'

export function ViewRecipe({ recipeId }) {
  const recipeQuery = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
  })
  const recipe = recipeQuery.data

  const userInfoQuery = useQuery({
    queryKey: ['users', recipe?.author],
    queryFn: () => getUserInfo(recipe?.author),
    enabled: Boolean(recipe?.author),
  })
  const userInfo = userInfoQuery.data ?? {}

  function truncate(str, max = 160) {
    if (!str) return str
    if (str.length > max) {
      return str.slice(0, max - 3) + '...'
    } else {
      return str
    }
  }

  return (
    <div style={{ padding: 8 }}>
      {recipe && (
        <Helmet>
          <title>{recipe.title} | Recipe Manager</title>
          <meta name='description' content={truncate(recipe.contents)} />
          <meta property='og:type' content='article' />
          <meta property='og:title' content={recipe.title} />
          <meta
            property='og:article:published_time'
            content={recipe.createdAt}
          />
          <meta
            property='og:article:modified_time'
            content={recipe.updatedAt}
          />
          <meta property='og:article:author' content={userInfo.username} />
          {(recipe.tags ?? []).map((tag) => (
            <meta key={tag} property='og:article:tag' content={tag} />
          ))}
        </Helmet>
      )}
      <Header />
      <br />
      <hr />
      <Link to='/'>Back to main page</Link>
      <br />
      <hr />
      {recipe ? (
        <Recipe {...recipe} fullRecipe />
      ) : (
        `Recipe with id ${recipeId} not found.`
      )}
    </div>
  )
}

ViewRecipe.propTypes = {
  recipeId: PropTypes.string.isRequired,
}
