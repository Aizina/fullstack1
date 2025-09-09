import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import LoginService from '../services/login'
import { setUser } from '../features/userSlice'
import blogService from '../services/blogs'
import loginService from '../services/login'
import { setTimedNotification } from '../features/notificationSlice'
import { TextField, Button, Card, CardContent, Typography, Stack } from '@mui/material'

const Login = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await LoginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setTimedNotification(`Welcome ${user.name}`, 'success', 4))
      setUsername('')
      setPassword('')
    } catch (error) {
      dispatch(setTimedNotification('Invalid username or password', 'error', 5))
      console.error('Login failed:', error)
    }
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>Login to Application</Typography>
        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField label="Username" value={username} onChange={({ target }) => setUsername(target.value)} fullWidth required />
            <TextField label="Password" type="password" value={password} onChange={({ target }) => setPassword(target.value)} fullWidth required />
            <Button type="submit" variant="contained">Login</Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  )
}

export default Login
