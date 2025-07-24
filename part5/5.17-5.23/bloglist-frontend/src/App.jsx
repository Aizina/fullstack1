import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import axios from 'axios'

axios.interceptors.request.use(config => {
  const raw = window.localStorage.getItem('loggedBlogAppUser')
  if (raw) {
    const { token } = JSON.parse(raw)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
});

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      const populatedBlog = { ...newBlog, user: { name: user.name, username: user.username, id: user.id } }
      setBlogs(blogs.concat(populatedBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)

    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to add new blog')
      console.log(error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleLike = async (blogToUpdate) => {
    try {
      const updatedBlogData = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      }
      const returnedBlog = await blogService.updateBlog(updatedBlogData)
      setBlogs(blogs.map(b => b.id === returnedBlog.id ? returnedBlog : b))
    } catch (error) {
      console.error('Failed to update likes:', error)
      setErrorMessage(error.response?.data?.error || 'Failed to update likes')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(b => b.id !== id))
      setSuccessMessage('Blog deleted successfully.')
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error) {
      console.error('Failed to delete blog:', error)
      setErrorMessage(error.response?.data?.error || 'Failed to delete blog')
      setTimeout(() => setErrorMessage(''), 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <Togglable buttonLabel='login'>
          <Login setUser={setUser} setErrorMessage={setErrorMessage} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default App