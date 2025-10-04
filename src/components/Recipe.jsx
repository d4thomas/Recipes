import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ _id, title, contents, author, image }) {
  return (
    <article>
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <div>
        <h4>Ingredients/Directions:</h4>
        {contents}
      </div>
      {author && (
        <em>
          <br />
          Added by <User id={author} />
        </em>
      )}
      <div>Recipe ID: {_id}</div>
    </article>
  )
}

Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  image: PropTypes.string,
}
