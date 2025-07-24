import DetailedBlog from "./DetailedBlog"
import { useState } from "react"
import PropTypes from 'prop-types'

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleToggle = () => {
    setShowDetails(!showDetails)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blog.id)
    }
  }

  const handleLike = () => {
    onLike(blog)
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={handleToggle}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && (
        <DetailedBlog
          blog={blog}
          user={user}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

Blog.propTypes = {
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
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default Blog
