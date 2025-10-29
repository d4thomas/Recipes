import { Link } from 'react-router-dom'
import slug from 'slug'
import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({
  title,
  contents,
  author,
  image,
  fullRecipe = false,
  id,
  likes = 0,
}) {
  return (
    <article>
      {fullRecipe ? (
        <p>
          <img
            src={image}
            alt={title}
            style={{ width: '20%', height: 'auto' }}
          />
          <br />
        </p>
      ) : (
        <Link to={`/recipes/${id}/${slug(title)}`}>
          <h3>{title}</h3>
          <p>
            {' '}
            <img
              src={image}
              alt={title}
              style={{ width: '20%', height: 'auto' }}
            />
          </p>
        </Link>
      )}

      {fullRecipe && (
        <div>
          <h4>Ingredients/Directions:</h4>
          {contents}
        </div>
      )}
      {!fullRecipe && author && (
        <em>
          <br />
          Added by <User {...author} />
        </em>
      )}
      {!fullRecipe && <div>Likes: {likes}</div>}
      {!fullRecipe && id && <div>Recipe ID: {id}</div>}
    </article>
  )
}

Recipe.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  image: PropTypes.string,
  fullRecipe: PropTypes.bool,
  likes: PropTypes.number,
}
