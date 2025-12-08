import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [ingredientInput, setIngredientInput] = useState('')
  const [image, setImage] = useState('')
  const [token] = useAuth()

  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: () => {
      const ingredients = ingredientInput
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line)
      return createRecipe(token, { title, ingredients, image })
    },
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })
  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
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
        <label htmlFor='create-ingredients'>Ingredients: </label>
        <textarea
          id='ingredient-input'
          placeholder='Enter ingredients, one per line (e.g.,&#10;2 cups flour&#10;1 cup sugar&#10;1 cup milk)'
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          rows={4}
          style={{ width: '400px' }}
        />
      </div>
      <br />
      <div>
        <label htmlFor='create-image'>Image URL: </label>
        <input
          type='url'
          name='create-image'
          id='create-image'
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <br />
      <br />
      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title || createRecipeMutation.isPending}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}
