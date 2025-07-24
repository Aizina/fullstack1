import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

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
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      blogFormRef.current.toggleVisibility()

      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)

    } catch (error) {
      setErrorMessage('Failed to add new blog')
      console.log(error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    }
  }

  const updateBlogLikes = (updatedBlog) => {
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
  }

  const removeBlog = (id) => {
    setBlogs(blogs.filter(b => b.id !== id))
    setSuccessMessage('Blog deleted successfully.')
    setTimeout(() => setSuccessMessage(''), 5000)
  }

  if (user === null) {
    return (
      <div>
        <Togglable buttonLabel='login'>
          <Login setUser={setUser} />
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
          onLikeUpdate={updateBlogLikes}
          onDeleteUpdate={removeBlog}
        />
      )}
    </div>
  )
}

export default App
