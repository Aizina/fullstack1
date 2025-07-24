import PropTypes from 'prop-types'

const DetailedBlog = ({ blog, user, onLike, onDelete }) => {
  if (!blog) {
    return <div>Loading blog...</div>
  }

  const isBlogOwner = blog.user && user && blog.user.username === user.username

  return (
    <div className="blog-details">
      <p>{blog.url}</p>
      <p>
        Likes: {blog.likes} <button onClick={onLike}>like</button>
      </p>
      <p>Added by: {blog.user?.name || 'Unknown'}</p>
      {isBlogOwner && <button onClick={onDelete}>remove</button>}
    </div>
  )
}

DetailedBlog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.object
  }).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string
  }),
  onLike: PropTypes.func,
  onDelete: PropTypes.func
}

export default DetailedBlog
