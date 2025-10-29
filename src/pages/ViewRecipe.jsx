import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useEffect, useState } from 'react'
import { Header } from '../components/Header.jsx'
import { Recipe } from '../components/Recipe.jsx'
import { getRecipeById } from '../api/recipes.js'
import { getUserInfo } from '../api/users.js'
import { recipeTrackEvent } from '../api/events.js'
import { RecipeStats } from '../components/RecipeStats.jsx'
import { LIKE_RECIPE } from '../api/graphql/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function ViewRecipe({ recipeId }) {
  const [token] = useAuth()
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => recipeTrackEvent({ recipeId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })
  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

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

  const [likeRecipe, { loading }] = useGraphQLMutation(LIKE_RECIPE, {
    variables: { id: recipeId },
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => {
      recipeQuery.refetch()
    },
  })

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
      <h1>{recipe.title}</h1>
      <hr />
      <Header />
      <hr />
      <h3>
        <Link to='/'>Main Page</Link>
      </h3>
      <hr />
      {recipe ? (
        <div>
          <Recipe {...recipe} id={recipeId} author={userInfo} fullRecipe />
          <hr />
          <div>
            <p>Likes: {recipe.likes ?? 0}</p>
            {token ? (
              <button onClick={() => likeRecipe()}>
                {loading ? 'Liking...' : 'Like Recipe'}
              </button>
            ) : (
              <p>Please log in to like this recipe.</p>
            )}
          </div>
          <hr /> <RecipeStats recipeId={recipeId} />
        </div>
      ) : (
        `Recipe with id ${recipeId} not found.`
      )}
    </div>
  )
}

ViewRecipe.propTypes = {
  recipeId: PropTypes.string.isRequired,
}
