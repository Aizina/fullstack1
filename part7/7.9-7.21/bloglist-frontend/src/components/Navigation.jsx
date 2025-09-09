import { Link as RouterLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearUser } from '../features/userSlice'
import { setTimedNotification } from '../features/notificationSlice'
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material'

const Navigation = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
    dispatch(setTimedNotification('Logged out', 'success', 4))
  }

  return (
    <AppBar position="static" color="default" sx={{ mb: 3 }}>
      <Toolbar>
        <Button component={RouterLink} to="/" color="inherit">Blogs</Button>
        <Button component={RouterLink} to="/users" color="inherit">Users</Button>
        <Box sx={{ flexGrow: 1 }} />
        {user && (
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user.name} logged in
          </Typography>
        )}
        {user && <Button color="error" variant="outlined" onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
