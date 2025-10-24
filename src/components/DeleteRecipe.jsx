import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import {
  DELETE_RECIPE,
  GET_RECIPES,
  GET_RECIPES_BY_AUTHOR,
} from '../api/graphql/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function DeleteRecipe() {
  const [token] = useAuth()
  const [recipeId, setRecipeId] = useState('')

  const [deleteRecipe, { loading, data }] = useGraphQLMutation(DELETE_RECIPE, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_RECIPES, GET_RECIPES_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    deleteRecipe({ variables: { id: recipeId } })
  }

  if (!token) return <div>Please log in to delete recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='delete-id'>Recipe ID: </label>
        <input
          type='text'
          name='delete-id'
          id='delete-id'
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={loading ? 'Deleting...' : 'Delete'}
        disabled={!recipeId || loading}
      />
      {data?.deleteRecipe ? (
        <>
          <br />
          Recipe deleted successfully!
        </>
      ) : null}
    </form>
  )
}
