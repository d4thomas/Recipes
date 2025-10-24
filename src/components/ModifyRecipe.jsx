import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import slug from 'slug'
import {
  MODIFY_RECIPE,
  GET_RECIPES,
  GET_RECIPES_BY_AUTHOR,
} from '../api/graphql/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function ModifyRecipe() {
  const [token] = useAuth()
  const [recipeId, setRecipeId] = useState('')
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [image, setImage] = useState('')

  const [updateRecipe, { loading, data }] = useGraphQLMutation(MODIFY_RECIPE, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [GET_RECIPES, GET_RECIPES_BY_AUTHOR],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const variables = {
      id: recipeId,
      title,
    }
    if (contents) variables.contents = contents
    if (image) variables.image = image

    updateRecipe({ variables })
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
        value={loading ? 'Modifying...' : 'Modify'}
        disabled={!recipeId || !title || loading}
      />
      {data?.updateRecipe ? (
        <>
          <br />
          Recipe{' '}
          <Link
            to={`/recipes/${data.updateRecipe.id}/${slug(
              data.updateRecipe.title,
            )}`}
          >
            {data.updateRecipe.title}
          </Link>{' '}
          modified successfully!
        </>
      ) : null}
    </form>
  )
}
