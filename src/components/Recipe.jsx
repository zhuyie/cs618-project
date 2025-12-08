import PropTypes from 'prop-types'
import { User } from './User.jsx'
export function Recipe({ title, ingredients, image, author }) {
  return (
    <article>
      <h3>{title}</h3>
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
      {image && <img src={image} alt={title} style={{ maxWidth: '100%', maxHeight: '400px', height: 'auto' }} />}
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
  ingredients: [PropTypes.string],
  image: PropTypes.string,
  author: PropTypes.string,
}
