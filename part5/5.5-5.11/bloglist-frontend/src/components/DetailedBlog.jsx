import blogService from '../services/blogs'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const DetailedBlog = ({ id, user }) => {
  const [blog, setBlog] = useState(null)


  useEffect(() => {
    if (id) {
      blogService.getBlog(id).then(data => setBlog(data))
    }
  }, [id])

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      const returnedBlog = await blogService.updateBlog(updatedBlog)
      setBlog(returnedBlog)
    } catch (error) {
      console.error('Failed to update likes:', error)
    }
  }

  const handleDelete = async () => {
    const confirm = window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
    if (!confirm) return

    try {
      await blogService.deleteBlog(blog.id)
      alert('Blog deleted successfully.')
      setBlog(null) 
      window.location.reload()
    } catch (error) {
      console.error('Failed to delete blog:', error)
      alert('Failed to delete blog')
    }
  }

  if (!blog) {
    return <div>Loading blog...</div>
  }

  const isBlogOwner = blog.user && user && blog.user.username === user.username

  return (
    <div>
      <p>{blog.url}</p>
      <p>Likes: {blog.likes} <button onClick={handleLike}>like</button></p>
      <p>Added by: {blog.user?.name || 'Unknown'}</p>
      {isBlogOwner && <button onClick={handleDelete}>remove</button>}
    </div>
  )
}

DetailedBlog.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    name: PropTypes.string
  })
}

export default DetailedBlog
