import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Users from './pages/Users'
import User from './pages/User'
import BlogView from './pages/BlogView'
import BlogListPage from './pages/BlogListPage'
import Navigation from './components/Navigation'
import Togglable from './components/Togglable'
import { initializeBlogs } from './features/blogSlice'
import { initializeUser } from './features/userSlice'
import { initializeUsers } from './features/usersSlice'
import { Container, Typography, Alert } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
    dispatch(initializeUsers())
  }, [dispatch])

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>Log in to application</Typography>
        {notification.message && (
          <Alert severity={notification.type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }}>
            {notification.message}
          </Alert>
        )}
        <Togglable buttonLabel="Login">
          <Login />
        </Togglable>
      </Container>
    )
  }

  return (
    <>
      <Navigation />
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {notification.message && (
          <Alert severity={notification.type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }}>
            {notification.message}
          </Alert>
        )}

        <Routes>
          <Route path="/" element={<BlogListPage user={user} />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
