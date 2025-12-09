export const getRecipes = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const getRecipeById = async (recipeId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`)
  if (!res.ok) throw new Error('Recipe not found')
  return await res.json()
}

export const createRecipe = async (token, recipe) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  })
  return await res.json()
}

export const likeRecipe = async (token, recipeId) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) throw new Error('failed to like/unlike recipe')
  return await res.json()
}
