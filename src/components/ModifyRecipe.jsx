import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { updateRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function ModifyRecipe() {
  const [token] = useAuth()
  const [recipeId, setRecipeId] = useState('')
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [image, setImage] = useState('')

  const queryClient = useQueryClient()

  const updateRecipeMutation = useMutation({
    mutationFn: () => {
      const updates = {}
      if (title) updates.title = title
      if (contents) updates.contents = contents
      if (image) updates.image = image
      return updateRecipe(token, recipeId, updates)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes'])
      setRecipeId('')
      setTitle('')
      setContents('')
      setImage('')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateRecipeMutation.mutate()
  }

  if (!token) return <div>Please log in to modify recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='modify-id'>Recipe ID: </label>
        <input
          type='text'
          name='modify-id'
          id='modify-id'
          value={recipeId}
          onChange={(e) => setRecipeId(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='modify-title'>Title: </label>
        <input
          type='text'
          name='modify-title'
          id='modify-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='modify-image'>Image URL: </label>
        <input
          type='text'
          name='modify-image'
          id='modify-image'
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <br />
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
      />
      <br />
      <br />
      <input
        type='submit'
        value={updateRecipeMutation.isPending ? 'Modifying...' : 'Modify'}
        disabled={!recipeId || updateRecipeMutation.isPending}
      />
      {updateRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe modified successfully!
        </>
      ) : null}
      {updateRecipeMutation.isError ? (
        <>
          <br />
          Error modifying recipe!
        </>
      ) : null}
    </form>
  )
}
