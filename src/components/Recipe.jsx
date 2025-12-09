import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likeRecipe } from '../api/recipes.js'
import { jwtDecode } from 'jwt-decode'

export function Recipe({ title, ingredients, image, author, likes, _id, isClickable = false }) {
  const [token] = useAuth()
  const queryClient = useQueryClient()
  const userId = token ? jwtDecode(token).sub : null
  const hasLiked = likes?.includes(userId)
  const likeMutation = useMutation({
    mutationFn: () => likeRecipe(token, _id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recipes'] }),
    onError: (err) => console.error('Like error:', err),
  })
  return (
    <article>
      <h3>
        {isClickable ? <Link to={`/recipe/${_id}`}>{title}</Link> : title}
      </h3>
      {ingredients && (
        <div>
          Ingredients:
          <ul>
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {image && (
        <img
          src={image}
          alt={title}
          style={{ maxWidth: '100%', maxHeight: '400px', height: 'auto' }}
        />
      )}
      <div>
        Likes: {likes?.length || 0}
        {token && (
          <button
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            style={{ marginLeft: '8px' }}
          >
            {likeMutation.isPending ? '...' : hasLiked ? 'Unlike' : 'Like'}
          </button>
        )}
      </div>
      {author && (
        <em>
          <br />
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}
Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  image: PropTypes.string,
  author: PropTypes.string,
  likes: PropTypes.arrayOf(PropTypes.string),
  _id: PropTypes.string.isRequired,
  isClickable: PropTypes.bool,
}
