import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRecipeById } from '../api/recipes.js'
import { Recipe } from '../components/Recipe.jsx'
import { Header } from '../components/Header.jsx'
import { navigate } from '../navigationRef.js'

export function RecipeDetail() {
  const { id } = useParams()
  const recipeQuery = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
  })
  const recipe = recipeQuery.data

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <button onClick={() => navigate('/')}>Back to Home</button>
      <br />
      <hr />
      {recipeQuery.isLoading && <p>Loading...</p>}
      {recipeQuery.error && <p>Recipe not found</p>}
      {recipe && <Recipe {...recipe} />}
    </div>
  )
}
