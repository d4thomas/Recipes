// import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMutation as useGraphQLMutation } from '@apollo/client/react/index.js'
import { useState } from 'react'
// import { createRecipe } from '../api/recipes.js'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { CREATE_RECIPE, GET_RECIPES } from '../api/graphql/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function CreateRecipe() {
  const [token] = useAuth()
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [image, setImage] = useState('')
  const [createRecipe, { loading, data }] = useGraphQLMutation(CREATE_RECIPE, {
    variables: { title, contents, image },
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [{ query: GET_RECIPES }],
    onCompleted: () => {
      setTitle('')
      setContents('')
      setImage('')
    },
  })

  //   const queryClient = useQueryClient()

  //   const createRecipeMutation = useMutation({
  //     mutationFn: () => createRecipe(token, { title, contents, image }),
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(['recipes'])
  //       setTitle('')
  //       setContents('')
  //       setImage('')
  //     },
  //   })

  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipe()
    // createRecipeMutation.mutate()
  }

  if (!token) return <div>Please log in to create new recipes.</div>

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-image'>Image URL: </label>
        <input
          type='text'
          name='create-image'
          id='create-image'
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
        value={loading ? 'Creating...' : 'Create'}
        disabled={!title || loading}
      />
      {data?.createRecipe ? (
        <>
          <br />
          Recipe{' '}
          <Link
            to={`/recipes/${data.createRecipe.id}/${slug(
              data.createRecipe.title,
            )}`}
          >
            {data.createRecipe.title}
          </Link>{' '}
          created successfully!
        </>
      ) : null}
    </form>
  )
}
