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
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    blogService.setToken(user.token)
    setUser(user);
    blogService.setToken(user.token); 
  }
}, []);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
    blogService.setToken(null);
  };

const addBlog = async (blogObject) => {
  try {
    const newBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(newBlog));
    setSuccessMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`);
    blogFormRef.current.toggleVisibility()
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000); 

  } catch (error) {
    setErrorMessage('Failed to add new Blog');
    console.log(error);

    setTimeout(() => {
      setErrorMessage('');
    }, 5000); 
  }
};


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
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Logout</button>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog = {addBlog} />
      </Togglable>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog key={blog.id} blog={blog} user = {user}/>
      ))}
    </div>
  )
}

export default App
