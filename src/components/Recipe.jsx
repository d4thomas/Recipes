import PropTypes from 'prop-types'

export function Recipe({ title, contents, author, image }) {
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
          Added by <strong>{author}</strong>
        </em>
      )}
    </article>
  )
}

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  image: PropTypes.string,
}
