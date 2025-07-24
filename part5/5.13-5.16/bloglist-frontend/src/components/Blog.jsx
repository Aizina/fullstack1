import DetailedBlog from "./DetailedBlog"
import { useState } from "react"
import PropTypes from 'prop-types'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onLikeUpdate, onDeleteUpdate }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [blogData, setBlogData] = useState(blog)

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

  const handleLike = async () => {
    const updatedBlog = {
      ...blogData,
      likes: blogData.likes + 1
    }

    try {
      const returnedBlog = await blogService.updateBlog(updatedBlog)
      setBlogData(returnedBlog)
      onLikeUpdate(returnedBlog)
    } catch (error) {
      console.error('Failed to update likes:', error)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm(`Remove blog ${blogData.title} by ${blogData.author}?`)
    if (!confirm) return

    try {
      await blogService.deleteBlog(blogData.id)
      onDeleteUpdate(blogData.id)
    } catch (error) {
      console.error('Failed to delete blog:', error)
      alert('Failed to delete blog')
    }
  }

  return (
    <div style={blogStyle} className="blog">
      {blogData.title} {blogData.author}
      <button onClick={handleToggle}>{showDetails ? 'hide' : 'view'}</button>
      {showDetails && (
        <DetailedBlog
          blog={blogData}
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
  onLikeUpdate: PropTypes.func.isRequired,
  onDeleteUpdate: PropTypes.func.isRequired
}

export default Blog
