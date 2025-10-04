import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { deleteRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function DeleteRecipe() {
  const [token] = useAuth()
  const [recipeId, setRecipeId] = useState('')

  const queryClient = useQueryClient()

  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(token, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes'])
      setRecipeId('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    deleteRecipeMutation.mutate()
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
        value={deleteRecipeMutation.isPending ? 'Deleting...' : 'Delete'}
        disabled={!recipeId || deleteRecipeMutation.isPending}
      />
      {deleteRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe deleted successfully!
        </>
      ) : null}
      {deleteRecipeMutation.isError ? (
        <>
          <br />
          Error deleting recipe!
        </>
      ) : null}
    </form>
  )
}
